import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { WebService } from "../webServices";
import { TrackSaver } from "./trackSaver/trackSaver";
import Types from "../types";

@injectable()
export class Race extends WebService {

    public constructor(@inject(Types.TrackSaver) private trackSaver: TrackSaver) {
        super();
        this.routeName = "/race";
    }

    protected defineRoutes(): void {
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Race endpoint");
        });

        this.addSubService(this.trackSaver);
    }
}
