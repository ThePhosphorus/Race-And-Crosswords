import { injectable, inject } from "inversify";
import { Request, Response, NextFunction, Router } from "express";
import {Grid} from "./grid/grid";
import {Lexical} from "./lexical/lexical";

import Types from "../types";
import { WebService } from "../webServices";

@injectable()
export class Crosswords extends WebService {

    public constructor(@inject(Types.Lexical) private lexical: Lexical, @inject(Types.Grid) private grid: Grid) {
        super();
        this._routerName = "/crosswords";
    }

    public get routes(): Router {
        const router: Router = Router();
        router.get("/", (req: Request, res: Response, next: NextFunction) => res.send("Crosswords endpoint"));

        router.use(this.lexical.routeName, this.lexical.routes);
        router.use(this.grid.routeName, this.grid.routes);

        return router;
    }
}
