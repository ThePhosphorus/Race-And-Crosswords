import { injectable } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import { Datamuse } from "./datamuse";
import { Word } from "../../../../common/communication/word";

@injectable()
export class Lexical {

    private datamuse: Datamuse;

    constructor() {
        this.datamuse = new Datamuse();
    }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Lexical service enpoint");
        });

        router.get("/easy-word", (req: Request, res: Response, next: NextFunction) => {
            this.datamuse.getEasyWord((word: Word) => {
                if (word) {
                    res.send(word);
                } else {
                    res.send("Bad request");
                }
            });
        });

        router.get("/hard-word", (req: Request, res: Response, next: NextFunction) => {
            this.datamuse.getHardWord((word: Word) => {
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
