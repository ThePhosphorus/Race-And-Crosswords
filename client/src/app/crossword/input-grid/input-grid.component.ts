import { Component, OnInit, HostListener, Output, EventEmitter } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Letter } from "../../../../../common/crossword/letter";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";

@Component({
    selector: "app-input-grid",
    templateUrl: "./input-grid.component.html",
    styleUrls: ["./input-grid.component.css"]
})
export class InputGridComponent implements OnInit {
    @Output() public showLoading: EventEmitter<boolean>;

    public twoDimensionGrid: Letter[][];

    public constructor(private _crosswordService: CrosswordService) {
        this.twoDimensionGrid = new Array<Array<Letter>>();
        this.showLoading = new EventEmitter<boolean>();
    }

    public ngOnInit(): void {
        this._crosswordService.gameManager.playerGridSubject.subscribe((crosswordGrid: CrosswordGrid) => {
            if (crosswordGrid.words.length > 0) {
                this.makeTwoDimensionGrid(crosswordGrid);
                this.showLoading.emit(false);
            } else {
                this.showLoading.emit(true);
            }
        });
    }

    private makeTwoDimensionGrid(grid: CrosswordGrid): void {
        this.twoDimensionGrid = new Array<Array<Letter>>();

        for (let i: number = 0; i < grid.size; i++) {
            this.twoDimensionGrid.push(new Array<Letter>());

            for (let j: number = 0; j < grid.size; j++) {
                this.twoDimensionGrid[i].push(grid.grid[(i * grid.size) + j]);
            }
        }
    }

    public unselectWord(): void {
        this._crosswordService.unselectWord();
    }

    @HostListener("window:keyup", ["$event"])
    public writeChar(event: KeyboardEvent): void {
        this._crosswordService.writeChar(event.key);
    }
}
