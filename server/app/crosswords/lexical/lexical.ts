import { injectable } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import { Datamuse } from "./datamuse";
import { Words } from "./words";

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

        router.get("/word", (req: Request, res: Response, next: NextFunction) => {
            this.datamuse.getWords((words: Words) => {
                if (!words.error) {
                    res.send(words.words);
                } else {
                    res.send("Bad request");
                }
            });
        });

        return router;
    }
}
