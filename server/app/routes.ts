import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import {CrosswordsRoutes} from "./crosswords/crosswords-router";

import Types from "./types";
import { Index } from "./routes/index";

@injectable()
export class Routes {
    private crosswordsRoutes: CrosswordsRoutes;
    public constructor( @inject(Types.Index) private index: Index ) {
        this.crosswordsRoutes = new CrosswordsRoutes();
     }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/",
                   (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));

        router.use("/crosswords", this.crosswordsRoutes.routes );

        return router;
    }
}
