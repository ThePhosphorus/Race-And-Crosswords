import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import {Crosswords} from "./crosswords/crosswords";

import Types from "./types";

@injectable()
export class Routes {
    public constructor(@inject(Types.Crosswords) private crosswords: Crosswords) {
    }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/",
                   (req: Request, res: Response, next: NextFunction) => res.send("log2990 router test"));

        router.use("/crosswords", this.crosswords.routes );

        return router;
    }
}
