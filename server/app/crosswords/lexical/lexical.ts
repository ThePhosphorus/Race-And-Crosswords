import { injectable } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

@injectable()
export class Lexical {

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Lexical service enpoint");
        });

        return router;
    }
}
