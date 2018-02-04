import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { WebService } from "../webServices";

@injectable()
export class Race extends WebService {

    public constructor() {
        super();
        this.routeName = "/race";
    }

    protected defineRoutes(): void {
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Race endpoint");
        });
    }
}
