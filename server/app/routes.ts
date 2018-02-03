import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import {Crosswords} from "./crosswords/crosswords";
import {Race} from "./race/race";

import Types from "./types";
import { WebService } from "./webServices";

@injectable()
export class Routes extends WebService {
    public constructor( @inject(Types.Crosswords) private crosswords: Crosswords, @inject(Types.Race) private race: Race ) {
        super();
    }

    public defineRoutes(): void {

        this._router.get("/", (req: Request, res: Response, next: NextFunction) => res.send("LOG2990 Server"));

        this.addSubService(this.crosswords);
        this.addSubService(this.race);
    }
}
