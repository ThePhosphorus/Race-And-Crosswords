import { Injectable } from "@angular/core";
import { CrosswordGrid, Letter, Word, Orientation } from "../../../../../common/communication/crossword-grid";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { CrosswordService } from "../crossword-service/crossword.service";

const INITIAL_GRID_SIZE: number = 10;
const EMPTY_TILE_CHARACTER: string = "\xa0\xa0";

export class GridState {
    public currentOrientation: Orientation;
    public currentLetter: number;
    public highlightedLetters: number[];
    public hoveredLetters: number[];
    public disabledLetters: number[];
    public currentPlayer: number;

    public constructor() {
        this.currentLetter = null;
        this.highlightedLetters = [];
        this.hoveredLetters = [];
        this.disabledLetters = [];
        this.currentOrientation = Orientation.Across;
        this.currentPlayer = 1;
    }
}

@Injectable()
export class DisplayService {
    private _solvedGrid: CrosswordGrid;
    private _playerGrid: CrosswordGrid;
    private _playerGridSubject: BehaviorSubject<CrosswordGrid>;
    private _gridState: GridState;
    private _gridStateSubject: BehaviorSubject<GridState>;

    public constructor(private _crosswordService: CrosswordService) {
        this._solvedGrid = new CrosswordGrid();
        this._playerGrid = new CrosswordGrid();
        this._playerGridSubject = new BehaviorSubject<CrosswordGrid>(this._playerGrid);
        this._gridState = new GridState;
        this._gridStateSubject = new BehaviorSubject<GridState>(this._gridState);
        this._crosswordService.grid.subscribe((grid: CrosswordGrid) => {
            this._solvedGrid = grid;
            this.relinkLetters(this._solvedGrid);
            this._playerGrid = JSON.parse(JSON.stringify(grid));
            this.relinkLetters(this._playerGrid);
            this._playerGrid.grid.forEach((letter: Letter) => {
                if (!letter.isBlackTile) {
                    letter.char = EMPTY_TILE_CHARACTER;
                }
            });
            this._playerGridSubject.next(this._playerGrid);
        });
        this.initializeEmptyGrid();
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

    public get gridState(): Observable<GridState> {
        return this._gridStateSubject.asObservable();
    }

    public get playerGrid(): Observable<CrosswordGrid> {
        return this._playerGridSubject.asObservable();
    }

    public setHoveredWord(word: Word): void {
        this._gridState.hoveredLetters = [];
        if (word != null) {
            for (const letter of word.letters) {
                this._gridState.hoveredLetters.push(letter.id);
            }
        }
        this._gridStateSubject.next(this._gridState);
    }

    public setSelectedLetter(index: number): void {
        if (this._gridState.disabledLetters.indexOf(index) === -1) {
            if (index === this._gridState.currentLetter) {
                this._gridState.currentOrientation = this._gridState.currentOrientation === Orientation.Across ?
                                                    Orientation.Down : Orientation.Across;
            } else {
                this._gridState.currentOrientation = Orientation.Across;
            }
            let targetWord: Word;
            if ((targetWord = this.findWordFromLetter(index, this._gridState.currentOrientation, false)) === null) {
                for (const ori of Object.keys(Orientation)) {
                    if (ori !== this._gridState.currentOrientation) {
                        this._gridState.currentOrientation = ori as Orientation;
                        targetWord = this.findWordFromLetter(index, ori, false);
                        break;
                    }
                }
            }
            this.setSelectedWord(targetWord);
            this._gridState.currentLetter = targetWord.letters[0].id;
            if (this._gridState.disabledLetters.indexOf(this._gridState.currentLetter) > -1) {
                this._gridState.currentLetter = this.findNextLetterId(true);
            }
        }
    }

    private findWordFromLetter(index: number, orientation: string, isSolved: boolean): Word {
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

    public setSelectedWord(word: Word): void {
        let startingIndex: number = null;
        for (const letter of word.letters) {
            if (this._gridState.disabledLetters.indexOf(letter.id) === -1) {
                startingIndex = letter.id;
                break;
            }
        }
        if (startingIndex != null) {
            this._gridState.currentOrientation = word.orientation;
            this._gridState.highlightedLetters = [];
            for (const letter of word.letters) {
                this._gridState.highlightedLetters.push(letter.id);
            }
            this._gridState.currentLetter = startingIndex;
        }
        this._gridStateSubject.next(this._gridState);
    }

    public unselectWord(): void {
        this._gridState.currentLetter = null;
        this._gridState.highlightedLetters = [];
        this._gridState.hoveredLetters = [];
        this._gridState.currentOrientation = Orientation.Across;
        this._gridStateSubject.next(this._gridState);
    }

    public writeChar(key: string): void {
        let nextLetterId: number;
        this._playerGrid.grid[this._gridState.currentLetter].char = key;
        this.verifyWords();
        nextLetterId = this.findNextLetterId(true);
        if (nextLetterId != null) {
            this._gridState.currentLetter = nextLetterId;
        }
    }

    public eraseChar(): void {
        let nextLetterId: number;
        if (this._playerGrid.grid[this._gridState.currentLetter].char === EMPTY_TILE_CHARACTER) {
            nextLetterId = this.findNextLetterId(false);
            if (nextLetterId != null) {
                this._gridState.currentLetter = nextLetterId;
            }
        }
        this._playerGrid.grid[this._gridState.currentLetter].char = EMPTY_TILE_CHARACTER;
    }

    private findNextLetterId(isForward: boolean): number {
        if (isForward) {
            for (let i: number = this._gridState.highlightedLetters.indexOf(this._gridState.currentLetter) + 1;
                                                        i < this._gridState.highlightedLetters.length; i++) {
                if (this._gridState.disabledLetters.indexOf(this._gridState.highlightedLetters[i]) === -1) {
                    return this._gridState.highlightedLetters[i];
                }
            }
        } else {
            for (let i: number = this._gridState.highlightedLetters.indexOf(this._gridState.currentLetter) - 1; i >= 0; i--) {
                if (this._gridState.disabledLetters.indexOf(this._gridState.highlightedLetters[i]) === -1) {
                    return this._gridState.highlightedLetters[i];
                }
            }
        }

        return null;
    }

    private verifyWords(): void {
        for (const orientation of Object.keys(Orientation)) {
            const playerWord: Word = this.findWordFromLetter(this._gridState.currentLetter, orientation, false);
            const solvedWord: Word = this.findWordFromLetter(this._gridState.currentLetter, orientation, true);
            if (playerWord != null) {
                if (playerWord.letters.map((lt: Letter) => (lt.char)).join("") ===
                    solvedWord.letters.map((lt: Letter) => (lt.char)).join("")) {
                    for (const letter of playerWord.letters) {
                        this._gridState.disabledLetters.push(letter.id);
                    }
                    if (orientation === this._gridState.currentOrientation) {
                        this.unselectWord();
                        this._crosswordService.addSolvedWord(this._playerGrid.words.indexOf(playerWord));
                    }
                }
            }
        }
    }
}
