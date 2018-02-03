import { injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { Datamuse } from "./datamuse";
import { Word } from "../../../../common/communication/word";
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

        this._router.post("/query-word", (req: Request, res: Response, next: NextFunction) => {
            this.datamuse.getWord("", true, (word: Word) => {
                if (word) {
                    res.send(word);
                } else {
                    res.send("Bad request");
                }
            });
        });
    }
}
