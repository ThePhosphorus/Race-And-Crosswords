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
        this._crosswordService.playerGrid.subscribe((crosswordGrid: CrosswordGrid) => {
            if (crosswordGrid.words.length > 0) {
                this.makeTwoDimensionGrid(crosswordGrid);
                this.showLoading.emit(false);
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

    // tslint:disable-next-line:no-any (the MouseEvent type has an invalid prototype) ////////////////////// TODO ///////////
    public unselectWord(mouseEvent: any): void {
        let unselect: boolean = true;
        mouseEvent.path.forEach((element: HTMLElement) => {
            if (element.tagName === "APP-INPUT-GRID" || element.tagName === "APP-DEFINITION") {
                unselect = false;
            }
        });
        if (unselect) {
            this._crosswordService.unselectWord();
        }
    }

    @HostListener("window:keyup", ["$event"])
    public writeChar(event: KeyboardEvent): void {
        this._crosswordService.writeChar(event.key);
    }
}
