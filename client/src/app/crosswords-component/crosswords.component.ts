import { Component, OnInit } from "@angular/core";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { CrosswordService } from "../crossword-service/crossword.service";
import { CrosswordGrid, Letter, Difficulty, Word, Orientation } from "../../../../common/communication/crossword-grid";

const INITIAL_GRID_SIZE: number = 10;
const INITIAL_BLACK_TILES_RATIO: number = 0.4;

@Component({
  selector: "app-crosswords",
  templateUrl: "./crosswords.component.html",
  styleUrls: ["./crosswords.component.css"],
  providers: [ CrosswordCommunicationService, CrosswordService ]
})
export class CrosswordsComponent implements OnInit {

    public grid: CrosswordGrid;

    private _cheatmode: boolean;

    public constructor(private crosswordService: CrosswordService) {
        this.grid = new CrosswordGrid();
        this.grid.size = INITIAL_GRID_SIZE;
        this.initializeGrid();
        this._cheatmode = false;
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

    private get acrossDefinitions(): string[] {
        return this.grid.words.filter((w: Word) => w.orientation === Orientation.Across)
                              .map((w: Word) => w.definitions[0]);
    }

    private get downDefinitions(): string[] {
        return this.grid.words.filter((w: Word) => w.orientation === Orientation.Down)
                              .map((w: Word) => w.definitions[0]);
    }

    public ngOnInit(): void {
        this.crosswordService.newGame(Difficulty.Easy, INITIAL_GRID_SIZE, INITIAL_BLACK_TILES_RATIO)
            .subscribe((grid: CrosswordGrid) => {
                this.grid = grid;
            });

    }
    public toogleCheatMode(): void {
        this._cheatmode = this._cheatmode;
    }

    public get cheatMode(): boolean {
        return this._cheatmode;
    }
}
