import { Router, Request, Response, NextFunction } from "express";
import { injectable } from "inversify";

@injectable()
export class Crosswords {

    public constructor() {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Crosswords enpoint");
        });

        router.get("/service-lexical",
                   (req: Request, res: Response, next: NextFunction) => {
                res.send("Lexical service endpoint");
            }
        );

        return router;
    }
}
