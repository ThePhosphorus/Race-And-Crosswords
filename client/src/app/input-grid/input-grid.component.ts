import { Component, OnInit } from "@angular/core";
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
    private _grid: CrosswordGrid;
    public currentOrientation: Orientation;
    public currentLetter: number;
    public highlightedLetters: number[];

    public constructor(private crosswordService: CrosswordService) {
        this.currentLetter = null;
        this.highlightedLetters = [];
        this.currentOrientation = Orientation.Across;
        this.initializeGrid();
    }

    public ngOnInit(): void {
        this.crosswordService.grid.subscribe((grid: CrosswordGrid) => {
            this._grid = grid;
        });
        this.crosswordService.newGame(Difficulty.Easy, INITIAL_GRID_SIZE, INITIAL_BLACK_TILES_RATIO);
    }

    private initializeGrid(): void {
        this._grid = new CrosswordGrid();
        this._grid.size = INITIAL_GRID_SIZE;
        for (let i: number = 0; i < (this._grid.size * this._grid.size); i++) {
            this._grid.grid.push(new Letter(""));
        }
    }

    public get twoDimensionGrid(): Letter[][] {
        const formattedGrid: Letter[][] = new Array<Array<Letter>>();
        for (let i: number = 0; i < this._grid.size; i++) {
            formattedGrid.push(new Array<Letter>());
            for (let j: number = 0; j < this._grid.size; j++) {
                formattedGrid[i].push(this._grid.grid[(i * this._grid.size) + j]);
            }
        }

        return formattedGrid;
    }

    public setSelectedLetter(index: number): void {
        this.currentOrientation = (index === this.currentLetter) ?
                                (this.currentOrientation === Orientation.Across ? Orientation.Down : Orientation.Across) :
                                (this.currentOrientation = Orientation.Across);
        let targetWord: Word;
        if ((targetWord = this.findWordFromLetter(index, this.currentOrientation)) === null) {
            for (const ori in Orientation) {
                if (ori !== this.currentOrientation) {
                    targetWord = this.findWordFromLetter(index, ori);
                }
            }
        }
        this.setSelectedWord(targetWord);
        this.currentLetter = index;
    }

    private findWordFromLetter(index: number, orientation: string): Word {
        for (const word of this._grid.words) {
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
        this.highlightedLetters = [];
        for (const letter of word.letters) {
                this.highlightedLetters.push(letter.id);
        }
        this.currentLetter = word.letters[0].id;
    }
}
