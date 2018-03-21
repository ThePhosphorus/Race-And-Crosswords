import { Difficulty, CrosswordGrid, Word, Letter } from "../../../../../common/communication/crossword-grid";
import { Players, Player } from "../../../../../common/communication/Player";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

const INITIAL_GRID_SIZE: number = 10;

export const EMPTY_TILE_CHARACTER: string = "\xa0\xa0";

export class GameManager {
    private _solvedGrid: CrosswordGrid;
    private _solvedWords: number[];
    private _players: BehaviorSubject<Player[]>;
    private _isMultiplayer: boolean;
    private _myPlayer: Players;
    private _difficulty: Difficulty;
    private _playerGridSubject: BehaviorSubject<CrosswordGrid>;
    private _solvedGridSubject: Subject<CrosswordGrid>;
    private _solvedWordsSubject: Subject<number[]>;
    private _currentPlayerSubject: Subject<number>;
    private _difficultySubject: Subject<Difficulty>;

    public constructor() {
        this._playerGridSubject = new BehaviorSubject<CrosswordGrid>(new CrosswordGrid());
        this._solvedGridSubject = new Subject<CrosswordGrid>();
        this._solvedWordsSubject = new Subject<number[]>();
        this._currentPlayerSubject = new Subject<number>();
        this._difficultySubject =  new Subject<Difficulty>();
        this._players = new BehaviorSubject<Player[]>(new Array<Player>());

        this.initializeEmptyGrid();
    }

    public newGame(): void {
        this._solvedGrid = new CrosswordGrid();
        this._solvedWords = [];
        this._isMultiplayer = false;
        this._myPlayer = Players.PLAYER1;
        this._difficulty = Difficulty.Easy;
        this.notifyAll();
    }

    private notifyAll(): void {
        this._difficultySubject.next(this._difficulty);
        this._playerGridSubject.next(new CrosswordGrid());
        this._solvedGridSubject.next(this._solvedGrid);
        this._solvedWordsSubject.next(this._solvedWords);
        this._currentPlayerSubject.next(this._myPlayer);
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

    public get playersObs(): Observable<Player[]> {
        return this._players.asObservable();
    }

    public get playerGridObs(): Observable<CrosswordGrid> {
        return this._playerGridSubject.asObservable();
    }

    public get solvedGridObs(): Observable<CrosswordGrid> {
        return this._solvedGridSubject.asObservable();
    }

    public set grid(crosswordGrid: CrosswordGrid) {
        this._solvedGrid = crosswordGrid;
        this.relinkLetters(this._solvedGrid);

        const playerGrid: CrosswordGrid = JSON.parse(JSON.stringify(crosswordGrid));
        this.relinkLetters(playerGrid);

        playerGrid.grid.forEach((letter: Letter) => {
            if (!letter.isBlackTile) {
                letter.char = EMPTY_TILE_CHARACTER;
            }
        });

        this._playerGridSubject.next(playerGrid);
        this._solvedGridSubject.next(this._solvedGrid);
    }

    public set players( players: Player[]) {
        this._players.next(players);
    }

    public getChar(index: number): string {
        return this._playerGridSubject.getValue().grid[index].char;
    }

    public setChar(index: number, char: string): void {
        this._playerGridSubject.value.grid[index].char = char;
    }

    public set difficulty(difficulty: Difficulty) {
        this._difficulty = difficulty;
        this._difficultySubject.next(this._difficulty);
    }

    public addSolvedWord(word: Word): boolean {
        this._solvedWords.push(this._playerGridSubject.getValue().words.indexOf(word));
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
        this._playerGridSubject.value.size = INITIAL_GRID_SIZE;
        for (let i: number = 0; i < (this._playerGridSubject.value.size * this._playerGridSubject.value.size); i++) {
            this._playerGridSubject.value.grid.push(new Letter(EMPTY_TILE_CHARACTER));
        }
    }

    public findWordFromLetter(index: number, orientation: string, isSolved: boolean): Word {
        const targetGrid: CrosswordGrid = isSolved ? this._solvedGrid : this._playerGridSubject.getValue();
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
