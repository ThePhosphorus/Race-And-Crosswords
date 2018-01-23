import { Router, Request, Response, NextFunction } from "express";

export class CrosswordsRoutes {

    public constructor() { }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send(" Hi ");
        });

        router.get("/service-lexical",
                   (req: Request, res: Response, next: NextFunction) => {
                res.send(JSON.stringify({ "testetst2": true }));
            }
        );

        return router;
    }
}
