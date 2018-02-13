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

    public constructor(private crosswordService: CrosswordService) {
         this._grid = new CrosswordGrid();
         this._grid.size = INITIAL_GRID_SIZE;
         this.initializeGrids();

    }

    private initializeGrids(): void {

        for (let i: number = 0; i < (this._grid.size * this._grid.size); i++) {
            this._grid.grid.push(new Letter(""));
        }
    }

    private get twoDimensionGrid(): Letter[][] {
        const formattedGrid: Letter[][] = new Array<Array<Letter>>();

        for (let i: number = 0; i < this._grid.size; i++) {
            formattedGrid.push(new Array<Letter>());
            for (let j: number = 0; j < this._grid.size; j++) {
                formattedGrid[i].push(this._grid.grid[(i * this._grid.size) + j]);
            }
        }

        return formattedGrid;
    }
    public ngOnInit(): void {
        this.crosswordService.newGame(Difficulty.Easy, INITIAL_GRID_SIZE, INITIAL_BLACK_TILES_RATIO)
            .subscribe((_grid: CrosswordGrid) => {
                this._grid = _grid;
            });
    }

    public onClick(i: number, isAcross: boolean): void {
        let clickedWord: Word;
        this._grid.words.forEach((w: Word) => {
            if ((w.orientation === Orientation.Across) === isAcross) {
                if (i === 0) {
                    clickedWord = w;
                } else {
                    i--;
                }

            }
        });
    }

}
