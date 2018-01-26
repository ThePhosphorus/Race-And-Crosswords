import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import {CrosswordsRoutes} from "./crosswords/crosswords-router";

import Types from "./types";

@injectable()
export class Routes {
    private crosswordsRoutes: CrosswordsRoutes;
    public constructor() {
        this.crosswordsRoutes = new CrosswordsRoutes();
     }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/",
                   (req: Request, res: Response, next: NextFunction) => res.send("log2990 router test"));

        router.use("/crosswords", this.crosswordsRoutes.routes );

        return router;
    }
}
