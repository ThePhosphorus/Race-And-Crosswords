import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import {Grid} from "./grid/grid";
import {Lexical} from "./lexical/lexical";

import Types from "../types";
import { WebService } from "../webServices";

@injectable()
export class Crosswords extends WebService {

    public constructor(@inject(Types.Lexical) private lexical: Lexical, @inject(Types.Grid) private grid: Grid) {
        super();
        this.routeName = "/crosswords";
    }

    protected defineRoutes(): void {
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => res.send("Crosswords endpoint"));

        this.addSubService(this.lexical);
        this.addSubService(this.grid);
    }
}
