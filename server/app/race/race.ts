import { Router, Request, Response, NextFunction } from "express";
import { injectable } from "inversify";

@injectable()
export class Race {

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Race endpoint");
        });

        return router;
    }
}
