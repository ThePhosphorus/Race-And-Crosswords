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
    providers: [CrosswordCommunicationService, CrosswordService]
})
export class CrosswordsComponent implements OnInit {

    public grid: CrosswordGrid;
    public enableInput: boolean[];
    private _cheatmode: boolean;


    public constructor(private crosswordService: CrosswordService) {
        this.grid = new CrosswordGrid();
        this.grid.size = INITIAL_GRID_SIZE;
        this.enableInput = new Array <boolean>();
        this.initializeGrids();
        this._cheatmode = false;
    }

    private initializeGrids(): void {
        let temp: boolean = false;
        for (let i: number = 0; i < (this.grid.size * this.grid.size); i++) {
            this.grid.grid.push(new Letter(""));
        }
        for (let j: number = 0; j < (this.grid.size); j++) {
            this.enableInput.push(temp);
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
            .map((w: Word) => this.toWord(w.letters));
    }

    private get downDefinitions(): string[] {
        return this.grid.words.filter((w: Word) => w.orientation === Orientation.Down).map((w: Word) => this.toWord(w.letters));
    }

    private toWord(letters: Letter[]): string {
        let str: string = "";
        letters.forEach((letter: Letter) => {
            str += letter.char;
        });

        return str;
    }

    public ngOnInit(): void {
        this.crosswordService.newGame(Difficulty.Easy, INITIAL_GRID_SIZE, INITIAL_BLACK_TILES_RATIO)
            .subscribe((grid: CrosswordGrid) => {
                this.grid = grid;
            });

    }
    public toogleCheatMode(): void {
        this._cheatmode = !this._cheatmode;
    }

    public get cheatMode(): boolean {
        return this._cheatmode;
    }
    private onClick(w: Word): void {
        w.letters.forEach((letter: Letter) => {
            this.enableInput[this.grid.grid.indexOf(letter)] = true;
        });
    }
}
