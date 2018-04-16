import { injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { Datamuse } from "./datamuse";
import { WebService } from "../../webServices";
import { Collection, MongoError } from "mongodb";
import { DbClient } from "../../mongo/DbClient";

const LEXICAL_COLLECTION: string = "words";
const MAX_WORD_LENGTH: number = 12;

@injectable()
export class Lexical extends WebService {

    private _datamuse: Datamuse;
    private _dbClient: DbClient;
    private _collection: Collection;

    constructor() {
        super();
        this.routeName = "/lexical";
        this._datamuse = new Datamuse();
        this._dbClient = new DbClient();
    }

    private connect(): void {
        if (this._dbClient.db != null) {
            this._collection = this._dbClient.db.collection(LEXICAL_COLLECTION);
        }
    }

    protected defineRoutes(): void {
        this._router.post("/query-word", (req: Request, res: Response, next: NextFunction) => {
            const constraint: string = req.body["constraint"];
            const isEasy: boolean = req.body["easy"];

            this.getWord(constraint, isEasy).then((word: string) => {
                // res.setHeader("Content-Type", "application/json");
                res.send(word);
            }).catch((err: Error) => {
                console.error(err.message);
                res.send(null);
            });
        });

        this._router.post("/query-definitions", (req: Request, res: Response, next: NextFunction) => {
            const word: string = req.body["word"];

            this._datamuse.getDefinitions(word).then((words: string[]) => {
                // res.setHeader("Content-Type", "application/json");
                res.send(words);
            }).catch((err: Error) => {
                console.error(err.message);
                res.send(null);
            });
        });

        this._router.post("/fill", (req: Request, res: Response, next: NextFunction) => {
            this.fillDB().then((nb: number) => res.send("Added up to " + nb + " words."));
        });
    }

    private async getWord(constraint: string, isEasy: boolean): Promise<string> {
        const str: {word: string}[] = await this.getMongoWords(constraint);

        if (str != null && str.length !== 0) {
            const id: number = Math.floor(Math.random() * str.length);

            return str[id].word;
        } else {
            const word: string = await this._datamuse.getWord(constraint, isEasy);
            console.error("filling : " + word);
            if (word != null) {
                this._collection.insertOne({word : word});
            }

            return word;
        }
    }

    private getRegex(constraint: string): string {
        let regex: string = "^";

        constraint.split("").forEach((char: string) =>
                regex += (char === "?") ? "." : char);

        regex += "$";

        return regex;
    }

    private getMongoWords(constraint: string): Promise<{word: string}[]> {
        this.connect();

        const regex: string = this.getRegex(constraint);

        return this._collection.aggregate<{word: string}>([ { $project: {_id : 0, word: 1} },
                                                            { $match : { word :  { $regex : regex }}}]).toArray();
    }

    private async fillDB(): Promise<number> {
        let count: number = 0;

        for (let i: number = 2; i < MAX_WORD_LENGTH; i++) {
            let constraint: string = "";
            for (let j: number = 0; j < i; j++) {
                constraint += "?";
            }
            const words: Array<string> = await this._datamuse.getWords(constraint);
            count += words.length;
            this.connect();

            words.forEach((word: string) => this._collection.insertOne({ word: word})
                .catch((e: MongoError) => console.error(e.message)));
        }

        return count;
    }
}
