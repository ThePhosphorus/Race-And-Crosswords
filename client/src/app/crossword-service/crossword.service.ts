import { Injectable } from "@angular/core";
import { Difficulty, CrosswordGrid } from "../../../../common/communication/crossword-grid";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { Subject } from "rxjs/Subject";
import { MOCK } from "../mock-crossword/mock-crossword";

const USE_MOCK_GRID: boolean = true;

const STARTING_GRID_SIZE: number = 4;
const STARTING_BLACK_TILE_RATIO: number = 0.3;

@Injectable()
export class CrosswordService {
    private _diff: Difficulty;
    private _gridSize: number;
    private _blackTilesRatio: number;
    private _gridSubject: Subject<CrosswordGrid>;
    private _playerColors: number[];

    public constructor(private commService: CrosswordCommunicationService) {
        this._diff = Difficulty.Easy;
        this._gridSize = STARTING_GRID_SIZE;
        this._blackTilesRatio = STARTING_BLACK_TILE_RATIO;
        this._gridSubject = new Subject<CrosswordGrid>();
        this._playerColors = [0];
    }

    public get difficulty(): Difficulty { return this._diff; }
    public get gridSize(): number { return this._gridSize; }
    public get blackTileRatio(): number { return this._blackTilesRatio; }
    public get playerColors(): number[] { return this._playerColors; }

    public get grid(): Observable<CrosswordGrid> {
        return USE_MOCK_GRID ? of(MOCK) : this._gridSubject.asObservable();
    }

    public newGame(difficulty: Difficulty, gridSize: number, btRatio: number): void {
        if (!USE_MOCK_GRID) {
            this._diff = difficulty;
            this._gridSize = gridSize;
            this._blackTilesRatio = btRatio;
            this.commService.getCrossword(difficulty, btRatio, gridSize).subscribe(this._gridSubject);
        }
    }
}
