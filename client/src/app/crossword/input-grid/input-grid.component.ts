import { Component, OnInit, HostListener, Output, EventEmitter } from "@angular/core";
import { CrosswordGrid, Letter } from "../../../../../common/communication/crossword-grid";
import { CrosswordService } from "../crossword-service/crossword.service";

@Component({
    selector: "app-input-grid",
    templateUrl: "./input-grid.component.html",
    styleUrls: ["./input-grid.component.css"]
})
export class InputGridComponent implements OnInit {
    @Output() public hideLoading: EventEmitter<boolean>;
    private _playerGrid: CrosswordGrid;
    public twoDimensionGrid: Letter[][];

    public constructor(private _crosswordService: CrosswordService) {
        this._playerGrid = new CrosswordGrid();
        this.twoDimensionGrid = new Array<Array<Letter>>();
        this.hideLoading = new EventEmitter<boolean>();
    }

    public ngOnInit(): void {
        this._crosswordService.grid.subscribe((crosswordGrid: CrosswordGrid) => {
            this._playerGrid = crosswordGrid;
            this.makeTwoDimensionGrid();
        });
        this.hideLoading.emit(true);
    }

    private makeTwoDimensionGrid(): void {
        this.twoDimensionGrid = new Array<Array<Letter>>();
        for (let i: number = 0; i < this._playerGrid.size; i++) {
            this.twoDimensionGrid.push(new Array<Letter>());
            for (let j: number = 0; j < this._playerGrid.size; j++) {
                this.twoDimensionGrid[i].push(this._playerGrid.grid[(i * this._playerGrid.size) + j]);
            }
        }
    }

    // tslint:disable-next-line:no-any (the MouseEvent type has an invalid prototype) ////////////////////// A REFAIRE ///////////
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
