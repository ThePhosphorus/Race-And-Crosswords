import { Component, OnInit, HostListener, Output, EventEmitter } from "@angular/core";
import { CrosswordGrid, Letter, Word } from "../../../../../common/communication/crossword-grid";
import { DisplayService, GridState } from "../display-service/display.service";

@Component({
    selector: "app-input-grid",
    templateUrl: "./input-grid.component.html",
    styleUrls: ["./input-grid.component.css"]
})
export class InputGridComponent implements OnInit {
    @Output() public hideLoading: EventEmitter<boolean>;
    private _playerGrid: CrosswordGrid;
    public gridState: GridState;
    public twoDimensionGrid: Letter[][];

    public constructor(private _displayService: DisplayService) {
        this.gridState = new GridState;
        this._playerGrid = new CrosswordGrid();
        this.twoDimensionGrid = new Array<Array<Letter>>();
        this.hideLoading = new EventEmitter<boolean>();
    }

    public ngOnInit(): void {
        this._displayService.playerGrid.subscribe((crosswordGrid: CrosswordGrid) => {
            this._playerGrid = crosswordGrid;
            this.makeTwoDimensionGrid();
        });
        this._displayService.gridState.subscribe((gridState: GridState) => {
            this.gridState = gridState;
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
        this.hideLoading.emit(false);
    }

    public setSelectedWord(word: Word): void {
        this._displayService.setSelectedWord(word);
    }

    public setHoveredWord(word: Word): void {
        this._displayService.setHoveredWord(word);
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
            this._displayService.unselectWord();
        }
    }

    @HostListener("window:keyup", ["$event"])
    public writeChar(event: KeyboardEvent): void {
        if (this.gridState.currentLetter != null) {
            if (event.key.match(/^[a-zA-z]$/i) != null) {
                this._displayService.writeChar(event.key.toLowerCase());
            } else if (event.key === "Backspace") {
                this._displayService.eraseChar();
            }
        }
    }
}
