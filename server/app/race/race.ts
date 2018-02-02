import { Router, Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { WebService } from "../webServices";

@injectable()
export class Race extends WebService {

    public constructor() {
        super("race/");
    }

    protected routes(): void {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Race endpoint");
        });
    }
}
