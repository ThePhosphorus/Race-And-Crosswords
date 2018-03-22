import { Difficulty, CrosswordGrid, Word, Letter } from "../../../../../common/communication/crossword-grid";
import { Players, Player } from "../../../../../common/communication/Player";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

const INITIAL_GRID_SIZE: number = 10;

export const EMPTY_TILE_CHARACTER: string = "\xa0\xa0";

export class SolvedWord {
    public constructor(public id: number, public player: Players) {}
}

export class GameManager {
    private _players: BehaviorSubject<Player[]>;
    private _playerGrid: BehaviorSubject<CrosswordGrid>;
    private _solvedWords: BehaviorSubject<SolvedWord[]>;
    private _solvedGrid: BehaviorSubject<CrosswordGrid>;
    private _currentPlayer: BehaviorSubject<number>;
    private _difficulty: BehaviorSubject<Difficulty>;

    public constructor() {
        this._playerGrid = new BehaviorSubject<CrosswordGrid>(new CrosswordGrid());
        this._solvedWords = new BehaviorSubject<SolvedWord[]>(new Array<SolvedWord>());
        this._solvedGrid = new BehaviorSubject<CrosswordGrid>(new CrosswordGrid());
        this._currentPlayer = new BehaviorSubject<number>(0);
        this._difficulty =  new BehaviorSubject<Difficulty>(Difficulty.Easy);
        this._players = new BehaviorSubject<Player[]>(new Array<Player>());

        this.initializeEmptyGrid();
    }

    public newGame(): void {
        this._solvedGrid.next(new CrosswordGrid());
        this._currentPlayer.next(Players.PLAYER1);
        this._difficulty.next(Difficulty.Easy);
    }

    public get difficultyObs(): Observable<Difficulty> {
        return this._difficulty.asObservable();
    }

    public get solvedWordsObs(): Observable<SolvedWord[]> {
        return this._solvedWords.asObservable();
    }

    public get currentPlayerObs(): Observable<Players> {
        return this._currentPlayer.asObservable();
    }

    public get playersObs(): Observable<Player[]> {
        return this._players.asObservable();
    }

    public get playerGridObs(): Observable<CrosswordGrid> {
        return this._playerGrid.asObservable();
    }

    public get solvedGridObs(): Observable<CrosswordGrid> {
        return this._solvedGrid.asObservable();
    }

    public set grid(crosswordGrid: CrosswordGrid) {
        const solvedGrid: CrosswordGrid = crosswordGrid; // TODO: create a function for copy is solvedGrid
        this.relinkLetters(solvedGrid);

        const playerGrid: CrosswordGrid = JSON.parse(JSON.stringify(crosswordGrid));
        this.relinkLetters(playerGrid);

        playerGrid.grid.forEach((letter: Letter) => {
            if (!letter.isBlackTile) {
                letter.char = EMPTY_TILE_CHARACTER;
            }
        });

        this._playerGrid.next(playerGrid);
        this._solvedGrid.next(solvedGrid);
    }

    public set players( players: Player[]) {
        this._players.next(players);
    }

    public set currentPlayer(player: Players) {
        this._currentPlayer.next(player);
    }

    public getChar(index: number): string {
        return this._playerGrid.getValue().grid[index].char;
    }

    public setChar(index: number, char: string): void {
        this._playerGrid.value.grid[index].char = char;
    }

    public set difficulty(difficulty: Difficulty) {
        this._difficulty.next(difficulty);
    }

    public addSolvedWord(word: Word): boolean {
        this._solvedWords.value.push(
            new SolvedWord(this._playerGrid.getValue().words.indexOf(word), this._currentPlayer.value));

        return this._solvedWords.value.length === this._solvedGrid.getValue().words.length;
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
        this._playerGrid.value.size = INITIAL_GRID_SIZE;
        for (let i: number = 0; i < (this._playerGrid.value.size * this._playerGrid.value.size); i++) {
            this._playerGrid.getValue().grid.push(new Letter(EMPTY_TILE_CHARACTER));
        }
    }

    public findWordFromLetter(index: number, orientation: string, isSolved: boolean): Word {
        const targetGrid: CrosswordGrid = isSolved ? this._solvedGrid.getValue() : this._playerGrid.getValue();
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
