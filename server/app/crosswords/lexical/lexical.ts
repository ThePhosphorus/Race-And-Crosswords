import { injectable } from "inversify";
import { Request, Response, NextFunction, Router } from "express";
import { Datamuse } from "./datamuse";
import { Word } from "../../../../common/communication/word";
import { WebService } from "../../webServices";

@injectable()
export class Lexical extends WebService {

    private datamuse: Datamuse;

    constructor() {
        super();
        this.datamuse = new Datamuse();
        this._routerName = "/lexical";
    }

    public get routes(): Router {
        const router: Router = Router();
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Lexical service enpoint");
        });

        router.post("/query-word", (req: Request, res: Response, next: NextFunction) => {
            this.datamuse.getWord("", true, (word: Word) => {
                if (word) {
                    res.send(word);
                } else {
                    res.send("Bad request");
                }
            });
        });

        return router;
    }
}
