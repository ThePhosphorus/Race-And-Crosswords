import { Request, Response, NextFunction, Router } from "express";
import { injectable, inject } from "inversify";
import { WebService } from "../../webServices";
import { Difficulty, GridGenerator } from "./grid-generator";
import types from "../../types";

const MIN_GRID_SIZE: number = 2;
const MAX_GRID_SIZE: number = 20;
const DEFAULT_GRID_SIZE: number = 20;
const DEFAULT_BLACK_TILES_RATIO: number = 0.3;

@injectable()
export class Grid extends WebService {

    constructor( @inject(types.GridGenerator) private gridGenerator: GridGenerator) {
        super();
        this._routerName = "/grid";
    }

    public get routes(): Router {
        const router: Router = Router();
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.send("Grid Endpoint. Please make a good Request to get grid");
            const difficulty: Difficulty = (req.query.difficulty !== undefined && Difficulty[req.query.difficulty] !== undefined)
                                            ? Difficulty[req.query.difficulty] as Difficulty : Difficulty.Easy;
            const blackTiles: number = (req.query.tiles !== undefined && Number(req.query.tiles))
                                            ? Math.max(0, Math.min(1, Number(req.query.tiles))) : DEFAULT_BLACK_TILES_RATIO;
            const size: number = (req.query.tiles !== undefined && Number(req.query.tiles))
                                            ? Math.max(MIN_GRID_SIZE, Math.min(MAX_GRID_SIZE, Number(req.query.tiles)))
                                            : DEFAULT_GRID_SIZE;
            res.send(this.gridGenerator.getNewGrid(difficulty, size, blackTiles));
        });

        return router;
    }
}
