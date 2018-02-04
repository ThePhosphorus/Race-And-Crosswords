import { Component, OnInit } from "@angular/core";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { CrosswordService } from "../crossword-service/crossword.service";
import { CrosswordGrid, Letter, Difficulty } from "../../../../common/communication/crossword-grid";

const INITIAL_GRID_SIZE: number = 10;
const INITIAL_BLACK_TILES_RATIO: number = 0.3;

@Component({
  selector: "app-crosswords",
  templateUrl: "./crosswords.component.html",
  styleUrls: ["./crosswords.component.css"],
  providers: [ CrosswordCommunicationService, CrosswordService ]
})
export class CrosswordsComponent implements OnInit {

    public grid: CrosswordGrid;

    public constructor(private crosswordService: CrosswordService) {
        this.grid = new CrosswordGrid();
        this.grid.size = INITIAL_GRID_SIZE;
        this.initializeGrid();
    }

    private initializeGrid(): void {
        for (let i: number = 0; i < (this.grid.size * this.grid.size); i++) {
            this.grid.grid.push(new Letter(""));
        }
    }

    private get twoDimensionGrid(): Letter[][] {
        const formattedGrid: Letter[][] = new Array<Array<Letter>>();

        for (let i: number = 0; i < this.grid.size; i++) {
            formattedGrid.push(new Array<Letter>());
            for (let j: number = 0; j < this.grid.size; j++) {
                formattedGrid[i].push(this.grid.grid[(i * this.grid.size) + j]);
            }
        }

        return formattedGrid;
    }

    public ngOnInit(): void {
        this.crosswordService.newGame(Difficulty.Easy, INITIAL_GRID_SIZE, INITIAL_BLACK_TILES_RATIO)
            .subscribe((grid: CrosswordGrid) => {
                this.grid = grid;
            });
    }
}
