import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import {Crosswords} from "./crosswords/crosswords";
import {Race} from "./race/race";

import Types from "./types";

@injectable()
export class Routes {
    public constructor(@inject(Types.Crosswords) private crosswords: Crosswords, @inject(Types.Race) private race: Race) {
    }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/",
                   (req: Request, res: Response, next: NextFunction) => res.send("log2990 router test"));

        router.use("/crosswords", this.crosswords.routes );
        router.use("/race", this.race.routes );

        return router;
    }
}
