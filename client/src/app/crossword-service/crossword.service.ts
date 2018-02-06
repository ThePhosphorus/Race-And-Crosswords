import { Injectable } from "@angular/core";
import { Difficulty, CrosswordGrid } from "../../../../common/communication/crossword-grid";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

const STARTING_GRID_SIZE: number = 4;
const STARTING_BLACK_TILE_RATIO: number = 0.3;

@Injectable()
export class CrosswordService {
    private _diff: Difficulty;
    private _gridSize: number;
    private _blackTilesRatio: number;

    private _currentGrid: CrosswordGrid;

    public constructor(private commService: CrosswordCommunicationService) {
        this._diff = Difficulty.Easy;
        this._gridSize = STARTING_GRID_SIZE;
        this._blackTilesRatio = STARTING_BLACK_TILE_RATIO;
        this._currentGrid = null;
    }

    public get difficulty(): Difficulty { return this._diff; }
    public get gridSize(): number { return this._gridSize; }
    public get blackTileRatio(): number { return this._blackTilesRatio; }

    public get currentGrid(): CrosswordGrid {
        return this._currentGrid;
    }

    public newGame(difficulty: Difficulty, gridSize: number, btRatio: number): Observable<CrosswordGrid> {
        this._diff = difficulty;
        this._gridSize = gridSize;
        this._blackTilesRatio = btRatio;
        this._currentGrid = null;
        const request: Observable<CrosswordGrid> = this.commService.getCrossword(difficulty, btRatio, gridSize);
        request.subscribe((grid: CrosswordGrid) => {
            this._currentGrid = grid;
        });

        return request;
    }
}
