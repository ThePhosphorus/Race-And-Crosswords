import { injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { Datamuse } from "./datamuse";
import { WebService } from "../../webServices";

@injectable()
export class Lexical extends WebService {

    private _datamuse: Datamuse;

    constructor() {
        super();
        this.routeName = "/lexical";
        this._datamuse = new Datamuse();
    }

    protected defineRoutes(): void {
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Lexical service enpoint");
        });

        this._router.post("/query-word", (req: Request, res: Response, next: NextFunction) => {
            const constraint: string = req.body["constraint"];
            const isEasy: boolean = req.body["easy"];

            this._datamuse.getWord(constraint, isEasy).then((word: string) => {
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
}
