import { injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { Datamuse } from "./datamuse";
import { WebService } from "../../webServices";
import { Collection } from "mongodb";
import { DbClient } from "../../mongo/DbClient";
import { DatamuseWord } from "../../../../common/communication/datamuse-word";

const LEXICAL_COLLECTION: string = "words";

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
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Lexical service enpoint");
        });

        this._router.post("/query-word", (req: Request, res: Response, next: NextFunction) => {
            const constraint: string = req.body["constraint"];
            const isEasy: boolean = req.body["easy"];

            this.getWord(constraint, isEasy).then((word: string) => {
                res.setHeader("Content-Type", "application/json");
                res.send(word);
            }).catch((err: Error) => {
                console.error(err.message);
                res.send(null);
            });
        });

        this._router.post("/query-definitions", (req: Request, res: Response, next: NextFunction) => {
            const word: string = req.body["word"];

            this._datamuse.getDefinitions(word).then((words: string) => {
                res.setHeader("Content-Type", "application/json");
                res.send(words);
            }).catch((err: Error) => {
                console.error(err.message);
                res.send(null);
            });
        });
    }

    private async getWord(constraint: string, isEasy: boolean): Promise<string> {
        const str: {word: string}[] = await this.getMongoWords(constraint);

        if (str != null && str.length !== 0) {
            const id: number = Math.floor(Math.random() % str.length);
            const datamuseword: DatamuseWord = new DatamuseWord();
            datamuseword.word = str[id].word;

            return JSON.stringify(datamuseword);
        } else {
            const word: string = await this._datamuse.getWord(constraint, isEasy);
            console.log("filling");
            if (word != null) {
                this._collection.insertOne({word : word});
            }

            return word;
        }
    }

    private getRegex(constraint: string): string {
        let regex: string = "^";

        constraint.split("").forEach((char: string) =>
                regex = regex.concat((char === "?") ? "." : char));

        return regex;
    }

    private getMongoWords(constraint: string): Promise<{word: string}[]> {
        this.connect();

        const regex: string = this.getRegex(constraint);

        return this._collection.aggregate<{word: string}>([ { $project: {_id : 0, word: 1} },
                                                            { $match : { word :  { $regex : regex }}}]).toArray();
    }
}
