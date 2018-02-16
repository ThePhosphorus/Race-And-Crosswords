import { Injectable } from "@angular/core";
import { Difficulty, CrosswordGrid } from "../../../../common/communication/crossword-grid";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

const STARTING_GRID_SIZE: number = 4;
const STARTING_BLACK_TILE_RATIO: number = 0.3;

@Injectable()
export class CrosswordService {
    private _diff: Difficulty;
    private _gridSize: number;
    private _blackTilesRatio: number;
    private _gridSubject: Subject<CrosswordGrid>;

    public constructor(private commService: CrosswordCommunicationService) {
        this._diff = Difficulty.Easy;
        this._gridSize = STARTING_GRID_SIZE;
        this._blackTilesRatio = STARTING_BLACK_TILE_RATIO;
        this._gridSubject = new Subject<CrosswordGrid>();
    }

    public get difficulty(): Difficulty { return this._diff; }
    public get gridSize(): number { return this._gridSize; }
    public get blackTileRatio(): number { return this._blackTilesRatio; }

    public get grid(): Observable<CrosswordGrid> {
        return this._gridSubject.asObservable();
    }

    public newGame(difficulty: Difficulty, gridSize: number, btRatio: number): void {
        this._diff = difficulty;
        this._gridSize = gridSize;
        this._blackTilesRatio = btRatio;
        this.commService.getCrossword(difficulty, btRatio, gridSize).subscribe(this._gridSubject);
    }
}
