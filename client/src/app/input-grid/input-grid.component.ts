import { Component, OnInit, HostListener } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { CrosswordGrid, Letter, Difficulty, Word, Orientation } from "../../../../common/communication/crossword-grid";
const INITIAL_GRID_SIZE: number = 10;
const INITIAL_BLACK_TILES_RATIO: number = 0.4;
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

@Component({
    selector: "app-input-grid",
    templateUrl: "./input-grid.component.html",
    styleUrls: ["./input-grid.component.css"],
})
export class InputGridComponent implements OnInit {
    private _playerGrid: CrosswordGrid;
    private _solvedGrid: CrosswordGrid;
    public gridState: GridState;

    public constructor(private _crosswordService: CrosswordService) {
        this.gridState = new GridState;
        this.initializeEmptyGrid();
    }

    public ngOnInit(): void {
        this._crosswordService.currentPlayer.subscribe((currentPlayer: number) => {
            this.gridState.currentPlayer = currentPlayer;
        });
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
        });
        this._crosswordService.newGame(Difficulty.Easy, INITIAL_GRID_SIZE, INITIAL_BLACK_TILES_RATIO);
    }

    public relinkLetters(crosswordGrid: CrosswordGrid): void {
        crosswordGrid.words.forEach((word: Word) => {
            const linkedLetters: Letter[] = [];
            word.letters.forEach((letter: Letter) => {
                linkedLetters.push(crosswordGrid.grid[letter.id]);
            });
            word.letters = linkedLetters;
        });
    }

    private initializeEmptyGrid(): void {
        this._solvedGrid = new CrosswordGrid();
        this._playerGrid = new CrosswordGrid();
        this._playerGrid.size = INITIAL_GRID_SIZE;
        for (let i: number = 0; i < (this._playerGrid.size * this._playerGrid.size); i++) {
            this._playerGrid.grid.push(new Letter(EMPTY_TILE_CHARACTER));
        }
    }

    public get twoDimensionPlayerGrid(): Letter[][] {
        const formattedGrid: Letter[][] = new Array<Array<Letter>>();
        for (let i: number = 0; i < this._playerGrid.size; i++) {
            formattedGrid.push(new Array<Letter>());
            for (let j: number = 0; j < this._playerGrid.size; j++) {
                formattedGrid[i].push(this._playerGrid.grid[(i * this._playerGrid.size) + j]);
            }
        }

        return formattedGrid;
    }

    public setSelectedLetter(index: number): void {
        if (this.gridState.disabledLetters.indexOf(index) === -1) {
            this.gridState.currentOrientation = (index === this.gridState.currentLetter) ?
                (this.gridState.currentOrientation === Orientation.Across ? Orientation.Down : Orientation.Across) :
                Orientation.Across;
            let targetWord: Word;
            if ((targetWord = this.findWordFromLetter(index, this.gridState.currentOrientation, false)) === null) {
                for (const ori of Object.keys(Orientation)) {
                    if (ori !== this.gridState.currentOrientation) {
                        this.gridState.currentOrientation = ori as Orientation;
                        targetWord = this.findWordFromLetter(index, ori, false);
                        break;
                    }
                }
            }
            this.setSelectedWord(targetWord);
            this.gridState.currentLetter = targetWord.letters[0].id;
            if (this.gridState.disabledLetters.indexOf(this.gridState.currentLetter) > -1) {
                this.gridState.currentLetter = this.findNextLetterIndex(true);
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
            if (this.gridState.disabledLetters.indexOf(letter.id) === -1) {
                startingIndex = letter.id;
                break;
            }
        }
        if (startingIndex != null) {
            this.gridState.currentOrientation = word.orientation;
            this.gridState.highlightedLetters = [];
            for (const letter of word.letters) {
                this.gridState.highlightedLetters.push(letter.id);
            }
            this.gridState.currentLetter = startingIndex;
        }
    }

    public setHoveredWord(word: Word): void {
        this.gridState.hoveredLetters = [];
        if (word != null) {
            for (const letter of word.letters) {
                this.gridState.hoveredLetters.push(letter.id);
            }
        }
    }

    // tslint:disable-next-line:no-any (the MouseEvent type has an invalid prototype)
    public unselectWord(mouseEvent: any): void {
        let unselect: boolean = true;
        mouseEvent.path.forEach((element: HTMLElement) => {
            if (element.tagName === "APP-INPUT-GRID" || element.tagName === "APP-DEFINITION") {
                unselect = false;
            }
        });
        if (unselect) {
            this.gridState.currentLetter = null;
            this.gridState.highlightedLetters = [];
            this.gridState.hoveredLetters = [];
            this.gridState.currentOrientation = Orientation.Across;
        }
    }

    @HostListener("window:keyup", ["$event"])
    public writeChar(event: KeyboardEvent): void {
        if (this.gridState.currentLetter != null) {
            let nextLetterIndex: number;
            if (event.key.match(/^[a-z]$/i) != null) {
                this._playerGrid.grid[this.gridState.currentLetter].char = event.key;
                this.verifyWords();
                nextLetterIndex = this.findNextLetterIndex(true);
                if (nextLetterIndex != null) {
                    this.gridState.currentLetter = this.gridState.highlightedLetters[nextLetterIndex];
                }
            } else if (event.key === "Backspace") {
                if (this._playerGrid.grid[this.gridState.currentLetter].char === EMPTY_TILE_CHARACTER) {
                    nextLetterIndex = this.findNextLetterIndex(false);
                    if (nextLetterIndex != null) {
                        this.gridState.currentLetter = this.gridState.highlightedLetters[nextLetterIndex];
                    }
                }
                this._playerGrid.grid[this.gridState.currentLetter].char = EMPTY_TILE_CHARACTER;
            }
        }
    }

    private findNextLetterIndex(isForward: boolean): number {
        if (isForward) {
            for (let i: number = this.gridState.highlightedLetters.indexOf(this.gridState.currentLetter) + 1;
                                                        i < this.gridState.highlightedLetters.length; i++) {
                if (this.gridState.disabledLetters.indexOf(this.gridState.highlightedLetters[i]) === -1) {
                    return this.gridState.highlightedLetters[i];
                }
            }
        } else {
            for (let i: number = this.gridState.highlightedLetters.indexOf(this.gridState.currentLetter) - 1; i >= 0; i--) {
                if (this.gridState.disabledLetters.indexOf(this.gridState.highlightedLetters[i]) === -1) {
                    return this.gridState.highlightedLetters[i];
                }
            }
        }

        return null;
    }

    private verifyWords(): void {
        for (const orientation of Object.keys(Orientation)) {
            const playerWord: Word = this.findWordFromLetter(this.gridState.currentLetter, orientation, false);
            const solvedWord: Word = this.findWordFromLetter(this.gridState.currentLetter, orientation, true);
            if (playerWord != null) {
                if (playerWord.letters.map((lt: Letter) => (lt.char)).join("") ===
                    solvedWord.letters.map((lt: Letter) => (lt.char)).join("")) {
                    for (const letter of playerWord.letters) {
                        this.gridState.disabledLetters.push(letter.id);
                    }
                    if (orientation === this.gridState.currentOrientation) {
                        this.gridState.currentLetter = null;
                        this.gridState.highlightedLetters = [];
                        this._crosswordService.addSolvedWord(this._playerGrid.words.indexOf(playerWord));
                    }
                }
            }
        }
    }
}
