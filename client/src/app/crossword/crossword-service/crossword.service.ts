import { Injectable } from "@angular/core";
import { Difficulty, CrosswordGrid } from "../../../../../common/communication/crossword-grid";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { Subject } from "rxjs/Subject";
import { MOCK } from "../mock-crossword/mock-crossword";

// Put true tu use mock grid instead of generated one
const USE_MOCK_GRID: boolean = false;

const STARTING_GRID_SIZE: number = 4;
const STARTING_BLACK_TILE_RATIO: number = 0.3;

@Injectable()
export class CrosswordService {
    private _gridSize: number;
    private _blackTilesRatio: number;
    private _grid: CrosswordGrid;
    private _gridSubject: Subject<CrosswordGrid>;
    private _solvedWords: number[];
    private _solvedWordsSubject: Subject<number[]>;
    private _currentPlayer: number;
    private _currentPlayerSubject: Subject<number>;
    private _diff: Difficulty;
    private _diffSubject: Subject<Difficulty>;

    public constructor(private commService: CrosswordCommunicationService) {
        this._gridSize = STARTING_GRID_SIZE;
        this._blackTilesRatio = STARTING_BLACK_TILE_RATIO;
        this._grid = new CrosswordGrid;
        this._gridSubject = new Subject<CrosswordGrid>();
        this._currentPlayer = 1;
        this._currentPlayerSubject = new Subject<number>();
        this._solvedWords = [];
        this._solvedWordsSubject = new Subject<number[]>();
        this._diff = Difficulty.Easy;
        this._diffSubject =  new Subject<Difficulty>();
    }

    public get gridSize(): number { return this._gridSize; }
    public get blackTileRatio(): number { return this._blackTilesRatio; }

    public get currentPlayer(): Observable<number> {
        return this._currentPlayerSubject.asObservable();
    }
    public get difficulty(): Observable<Difficulty> {
        return this._diffSubject.asObservable(); }

    public get solvedWords(): Observable<number[]> {
        return this._solvedWordsSubject.asObservable();
    }

    public get grid(): Observable<CrosswordGrid> {
        return USE_MOCK_GRID ? of(MOCK) : this._gridSubject.asObservable();
    }

    public newGame(difficulty: Difficulty, gridSize: number, btRatio: number): Observable<CrosswordGrid> {
        if (!USE_MOCK_GRID) {
            this._diff = difficulty;
            this._diffSubject.next(this._diff);
            this._gridSize = gridSize;
            this._blackTilesRatio = btRatio;
            this.commService.getCrossword(difficulty, btRatio, gridSize).subscribe((crosswordGrid: CrosswordGrid) => {
                this._grid = crosswordGrid;
                this._gridSubject.next(this._grid);
            });
        }
        this._currentPlayer = 1;
        this._currentPlayerSubject.next(this._currentPlayer);
        this._solvedWords = [];
        this._solvedWordsSubject.next(this._solvedWords);

        return this.grid;
    }

    public addSolvedWord(index: number): void {
        this._solvedWords.push(index);
        this._solvedWordsSubject.next(this._solvedWords);
        if (this._solvedWords.length === this._grid.words.length) {
            this.newGame(this._diff, this._gridSize, this._blackTilesRatio);
        }
    }
}
