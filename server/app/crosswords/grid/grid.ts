import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { WebService } from "../../webServices";
import {GridGenerator } from "./grid-generator";
import {Difficulty} from "../../../../common/communication/crossword-grid";

const MIN_GRID_SIZE: number = 2;
const MAX_GRID_SIZE: number = 20;
const DEFAULT_GRID_SIZE: number = 10;
const DEFAULT_BLACK_TILES_RATIO: number = 0.3;

@injectable()
export class Grid extends WebService {

    private gridGenerator: GridGenerator;

    constructor() {
        super();
        this.routeName = "/grid";
        this.gridGenerator = new GridGenerator();
    }

    public defineRoutes(): void {
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
            const difficulty: Difficulty = (req.query.difficulty !== undefined && Number(req.query.difficulty))
                                            ? Math.floor(Math.max(Difficulty.Easy, Math.min(Difficulty.Hard, Number(req.query.difficulty))))
                                            : Difficulty.Easy;
            const blackTiles: number = (req.query.tiles !== undefined && Number(req.query.tiles))
                                            ? Math.max(0, Math.min(1, Number(req.query.tiles))) : DEFAULT_BLACK_TILES_RATIO;
            const size: number = (req.query.tiles !== undefined && Number(req.query.tiles))
                                            ? Math.max(MIN_GRID_SIZE, Math.min(MAX_GRID_SIZE, Number(req.query.tiles)))
                                            : DEFAULT_GRID_SIZE;
            res.send(this.gridGenerator.getNewGrid(difficulty, size, blackTiles));
        });
    }
}
