import { WebService } from "../../webServices";
import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";

@injectable()
export class Multiplayer extends WebService {

    public constructor() {
        super();
        this.routeName = "/multiplayer";
    }

    protected defineRoutes(): void {
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => res.send("Multiplayer End point!"));

    }
}
