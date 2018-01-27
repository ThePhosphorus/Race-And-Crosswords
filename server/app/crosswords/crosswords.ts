import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import {Grid} from "./grid/grid";
import {Lexical} from "./lexical/lexical";

import Types from "../types";

@injectable()
export class Crosswords {

    public constructor(@inject(Types.Lexical) private lexical: Lexical, @inject(Types.Grid) private grid: Grid) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => res.send("Crosswords enpoint"));

        router.use("/lexical", this.lexical.routes );
        router.use("/grid", this.grid.routes );

        return router;
    }
}
