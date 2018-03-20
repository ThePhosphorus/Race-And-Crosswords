import { Difficulty, CrosswordGrid, Word, Letter } from "../../../../../common/communication/crossword-grid";
import { Players } from "../../../../../common/communication/Player";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

const INITIAL_GRID_SIZE: number = 10;

export const EMPTY_TILE_CHARACTER: string = "\xa0\xa0";

export class GameManager {
    private _solvedGrid: CrosswordGrid;
    private _playerGrid: CrosswordGrid;
    private _solvedWords: number[];
    private _currentPlayer: number;
    private _isMultiplayer: boolean;
    private _myPlayer: Players;
    private _difficulty: Difficulty;
    private _playerGridSubject: BehaviorSubject<CrosswordGrid>;
    private _solvedWordsSubject: Subject<number[]>;
    private _currentPlayerSubject: Subject<number>;
    private _difficultySubject: Subject<Difficulty>;

    public constructor() {
        this._solvedGrid = new CrosswordGrid();
        this._playerGrid = new CrosswordGrid();
        this._currentPlayer = Players.PLAYER1;
        this._solvedWords = [];
        this._isMultiplayer = false;
        this._myPlayer = Players.PLAYER1;
        this._difficulty = Difficulty.Easy;
        this._playerGridSubject = new BehaviorSubject<CrosswordGrid>(this._playerGrid);
        this._solvedWordsSubject = new Subject<number[]>();
        this._currentPlayerSubject = new Subject<number>();
        this._difficultySubject =  new Subject<Difficulty>();

        this.initializeEmptyGrid();
    }

    public get difficultyObs(): Observable<Difficulty> {
        return this._difficultySubject.asObservable();
    }

    public get solvedWordsObs(): Observable<number[]> {
        return this._solvedWordsSubject.asObservable();
    }

    public get currentPlayerObs(): Observable<Players> {
        return this._currentPlayerSubject.asObservable();
    }

    public get gridObs(): Observable<CrosswordGrid> {
        return this._playerGridSubject.asObservable();
    }

    public set grid(crosswordGrid: CrosswordGrid) {
        this._solvedGrid = crosswordGrid;
        this.relinkLetters(this._solvedGrid);
        this._playerGrid = JSON.parse(JSON.stringify(crosswordGrid));
        this.relinkLetters(this._playerGrid);
        this._playerGrid.grid.forEach((letter: Letter) => {
            if (!letter.isBlackTile) {
                letter.char = EMPTY_TILE_CHARACTER;
            }
        });
        this._playerGridSubject.next(this._playerGrid);
    }

    public getChar(index: number): string {
        return this._playerGrid.grid[index].char;
    }

    public setChar(index: number, char: string): void {
        this._playerGrid.grid[index].char = char;
    }

    public set difficulty(difficulty: Difficulty) {
        this._difficulty = difficulty;
        this._difficultySubject.next(this._difficulty);
    }

    public addSolvedWord(word: Word): boolean {
        this._solvedWords.push(this._playerGrid.words.indexOf(word));
        this._solvedWordsSubject.next(this._solvedWords);

        return this._solvedWords.length === this._solvedGrid.words.length;
    }

    private relinkLetters(crosswordGrid: CrosswordGrid): void {
        if (crosswordGrid) {
            crosswordGrid.words.forEach((word: Word) => {
                const linkedLetters: Letter[] = [];
                word.letters.forEach((letter: Letter) => {
                    linkedLetters.push(crosswordGrid.grid[letter.id]);
                });
                word.letters = linkedLetters;
            });
        }
    }

    private initializeEmptyGrid(): void {
        this._playerGrid.size = INITIAL_GRID_SIZE;
        for (let i: number = 0; i < (this._playerGrid.size * this._playerGrid.size); i++) {
            this._playerGrid.grid.push(new Letter(EMPTY_TILE_CHARACTER));
        }
        this._playerGridSubject.next(this._playerGrid);
    }

    public findWordFromLetter(index: number, orientation: string, isSolved: boolean): Word {
        const targetGrid: CrosswordGrid = isSolved ? this._solvedGrid : this._playerGrid;
        for (const word of targetGrid.words) {
            if (word.orientation === orientation) {
                for (const letter of word.letters) {
                    if (index === letter.id) {
                        return word;
                    }
                }
            }
        }

        return null;
    }
}
