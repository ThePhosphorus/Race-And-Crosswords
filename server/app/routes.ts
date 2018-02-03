import { injectable, inject } from "inversify";
import { Request, Response, NextFunction, Router } from "express";
import {Crosswords} from "./crosswords/crosswords";
import {Race} from "./race/race";

import Types from "./types";
import { WebService } from "./webServices";

@injectable()
export class Routes extends WebService {
    public constructor( @inject(Types.Crosswords) private crosswords: Crosswords, @inject(Types.Race) private race: Race ) {
        super();
        this._routerName = "/";
    }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => res.send("LOG2990 Server"));
        router.use(this.crosswords.routeName, this.crosswords.routes);
        router.use(this.race.routeName, this.race.routes);

        return router;
    }
}
