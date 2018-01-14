import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";

@injectable()
export class Routes {

    public constructor(@inject(Types.Index) private index: Index) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/",
                   (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));

        return router;
    }
}
