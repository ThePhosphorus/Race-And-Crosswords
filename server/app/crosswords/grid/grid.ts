import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { WebService } from "../../webServices";

@injectable()
export class Grid extends WebService {

    constructor() {
        super("grid");
    }

    protected routes(): void {
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Grid generation enpoint");
        });
    }
}
