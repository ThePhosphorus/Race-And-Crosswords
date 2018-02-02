import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { WebService } from "../../webServices";
import { Difficulty, GridGenerator } from "./grid-generator";
import types from "../../types";

const MIN_GRID_SIZE: number = 2;

@injectable()
export class Grid extends WebService {

    constructor(@inject(types.GridGenerator) private gridGenerator: GridGenerator) {
        super("grid");
    }

    protected routes(): void {
        this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
            const crosswordsParameters: CrosswordParameters = JSON.parse(req.body);
            if (crosswordsParameters.exists){
                res.send(this.gridGenerator.getNewGrid(
                    crosswordsParameters.difficulty,
                    crosswordsParameters.size,
                    crosswordsParameters.blackTileRatio
                ));
            }
            res.send("Grid Endpoint. Please make a good Request to get grid");

        });
    }
}

class CrosswordParameters {
    constructor(public difficulty: Difficulty, public size: number, public blackTileRatio: number){}
    public get exists (): boolean {
        return (Difficulty != null &&
            this.size != null &&
            this.size > MIN_GRID_SIZE &&
            this.blackTileRatio != null &&
            this.blackTileRatio > 0 &&
            this.blackTileRatio < 1);
    }
}