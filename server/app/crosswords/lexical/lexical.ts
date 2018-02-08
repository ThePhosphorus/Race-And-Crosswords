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
            const isEasy: boolean = req.body["easy"];

            this.datamuse.getWords(constraint, isEasy).then((words: string) => {
                res.send(words);
            });
        });
        this._router.post("/query-word", (req: Request, res: Response, next: NextFunction) => {
            const constraint: string = req.body["constraint"];
            const isEasy: boolean = req.body["easy"];

            this.datamuse.getWord(constraint, isEasy).then((word: string) => {
                res.send(word);
            });
        });
        this._router.post("/test-word", (req: Request, res: Response, next: NextFunction) => {
            const word: string = req.body["word"];

            this.datamuse.getDefinitions(word).then((words: string) => {
                res.send(words);
            });
        });
    }
}
