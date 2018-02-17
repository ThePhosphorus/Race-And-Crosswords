import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { WebService } from "../../webServices";

@injectable()
export class TrackSaver extends WebService {

    public constructor() {
        super();
        this.routeName = "/trackSaver";
    }

    protected defineRoutes(): void {
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Race endpoint");
        });
    }
}
