import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { WebService } from "../../webServices";
import {CrosswordGrid} from "../../../../common/crossword/crossword-grid";
import { Difficulty } from "../../../../common/crossword/enums-constants";
import { GridGenerator } from "./grid-generator/grid-generator";

const MIN_GRID_SIZE: number = 2;
const MAX_GRID_SIZE: number = 20;
const DEFAULT_GRID_SIZE: number = 10;

@injectable()
export class Grid extends WebService {

    private _gridGenerator: GridGenerator;

    constructor() {
        super();
        this.routeName = "/grid";
        this._gridGenerator = new GridGenerator();
    }

    protected defineRoutes(): void {
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
            const difficulty: Difficulty = (req.query.difficulty !== undefined && Number(req.query.difficulty))
                                            ? Math.floor(Math.max(Difficulty.Easy, Math.min(Difficulty.Hard, Number(req.query.difficulty))))
                                            : Difficulty.Easy;
            const size: number = (req.query.size !== undefined && Number(req.query.size))
                                            ? Math.max(MIN_GRID_SIZE, Math.min(MAX_GRID_SIZE, Number(req.query.size)))
                                            : DEFAULT_GRID_SIZE;

            res.setHeader("Content-Type", "application/json");
            this._gridGenerator.getNewGrid(difficulty, size).then((crossword: CrosswordGrid) => res.send(crossword)).catch((err: Error) => {
                console.error(err.message);
                res.send(null);
            });
        });
    }
}
