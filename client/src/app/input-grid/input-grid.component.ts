import { Component, OnInit, HostListener } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { CrosswordGrid, Letter, Difficulty, Word, Orientation } from "../../../../common/communication/crossword-grid";
const INITIAL_GRID_SIZE: number = 10;
const INITIAL_BLACK_TILES_RATIO: number = 0.4;

@Component({
    selector: "app-input-grid",
    templateUrl: "./input-grid.component.html",
    styleUrls: ["./input-grid.component.css"],
})
export class InputGridComponent implements OnInit {
    private _playerGrid: CrosswordGrid;
    private _solvedGrid: CrosswordGrid;
    public currentOrientation: Orientation;
    public currentLetter: number;
    public highlightedLetters: number[];
    public hoveredLetters: number[];
    public disabledLetters: number[];

    public constructor(private crosswordService: CrosswordService) {
        this.currentLetter = null;
        this.highlightedLetters = [];
        this.hoveredLetters = [];
        this.disabledLetters = [];
        this.currentOrientation = Orientation.Across;
        this.initializeEmptyGrid();
    }

    public ngOnInit(): void {
        this.crosswordService.grid.subscribe((grid: CrosswordGrid) => {
            this._solvedGrid = grid;
            this.relinkLetters(this._solvedGrid);
            this._playerGrid = JSON.parse(JSON.stringify(grid));
            this.relinkLetters(this._playerGrid);
            this._playerGrid.grid.forEach((letter: Letter) => {
                if (!letter.isBlackTile) {
                    letter.char = " ";
                }
            });
        });
        this.crosswordService.newGame(Difficulty.Easy, INITIAL_GRID_SIZE, INITIAL_BLACK_TILES_RATIO);
    }

    private relinkLetters(crosswordGrid: CrosswordGrid): void {
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
            this._playerGrid.grid.push(new Letter(" "));
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
        if (this.disabledLetters.indexOf(index) === -1) {
            this.currentOrientation = (index === this.currentLetter) ?
                (this.currentOrientation === Orientation.Across ? Orientation.Down : Orientation.Across) :
                (this.currentOrientation = Orientation.Across);
            let targetWord: Word;
            if ((targetWord = this.findWordFromLetter(index, this.currentOrientation, false)) === null) {
                for (const ori in Orientation) {
                    if (ori !== this.currentOrientation) {
                        this.currentOrientation = ori as Orientation;
                        targetWord = this.findWordFromLetter(index, ori, false);
                    }
                }
            }
            this.setSelectedWord(targetWord);
            this.currentLetter = index;
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
        this.currentOrientation = word.orientation;
        this.highlightedLetters = [];
        for (const letter of word.letters) {
            this.highlightedLetters.push(letter.id);
        }
        this.currentLetter = this.highlightedLetters[0];
    }

    public setHoveredWord(word: Word): void {
        this.hoveredLetters = [];
        if (word !== null) {
            for (const letter of word.letters) {
                this.hoveredLetters.push(letter.id);
            }
        }
    }

    @HostListener("window:keyup", ["$event"])
    public writeChar(event: KeyboardEvent): void {
        if (this.currentLetter != null) {
            let nextLetterIndex: number;
            if (event.key.match(/^[a-z]$/i) !== null) {
                this._playerGrid.grid[this.currentLetter].char = event.key;
                nextLetterIndex = this.findNextLetterIndex(true);
                if (nextLetterIndex !== null) {
                    this.currentLetter = this.highlightedLetters[nextLetterIndex];
                } else {
                    this.verifyWord();
                }
            } else if (event.key === "Backspace") {
                this._playerGrid.grid[this.currentLetter].char = " ";
                nextLetterIndex = this.findNextLetterIndex(false);
                if (nextLetterIndex !== null) {
                    this.currentLetter = this.highlightedLetters[nextLetterIndex];
                } else {
                    this.verifyWord();
                }
            }
        }
    }

    private findNextLetterIndex(isForward: boolean): number {
        if (isForward) {
            for (let i: number = this.highlightedLetters.indexOf(this.currentLetter) + 1; i < this.highlightedLetters.length; i++) {
                if (this.disabledLetters.indexOf(this.highlightedLetters[i]) === -1) {
                    return i;
                }
            }
        } else {
            for (let i: number = this.highlightedLetters.indexOf(this.currentLetter) - 1; i >= 0; i--) {
                if (this.disabledLetters.indexOf(this.highlightedLetters[i]) === -1) {
                    return i;
                }
            }
        }

        return null;
    }

    private verifyWord(): void {
        const playerWord: Word = this.findWordFromLetter(this.currentLetter, this.currentOrientation, false);
        const solvedWord: Word = this.findWordFromLetter(this.currentLetter, this.currentOrientation, true);
        if (playerWord !== null) {
            if (playerWord.letters.map((lt: Letter) => (lt.char)).join("") ===
                solvedWord.letters.map((lt: Letter) => (lt.char)).join("")) {
                for (const letter of playerWord.letters) {
                    this.disabledLetters.push(letter.id);
                }
                this.currentLetter = null;
            }
        }
    }
}
