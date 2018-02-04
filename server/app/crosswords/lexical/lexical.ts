import { injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { Datamuse } from "./datamuse";
import { WebService } from "../../webServices";

@injectable()
export class Lexical extends WebService {

    private datamuse: Datamuse;

    constructor() {
        super();
        this.routeName = "/lexical";
        this.datamuse = new Datamuse();
    }

    protected defineRoutes(): void {
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Lexical service enpoint");
        });

        this._router.post("/query-words", (req: Request, res: Response, next: NextFunction) => {
            const constraint: string = req.body["constraint"];
            const easy: boolean = req.body["easy"];

            this.datamuse.getWords(constraint, easy).then((words: string) => {
                res.send(words);
            });
        });
    }
}
