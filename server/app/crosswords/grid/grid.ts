import { Router, Request, Response, NextFunction } from "express";
import { injectable } from "inversify";

@injectable()
export class Grid {

    public constructor() {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Grid generation enpoint");
        });

        return router;
    }
}
