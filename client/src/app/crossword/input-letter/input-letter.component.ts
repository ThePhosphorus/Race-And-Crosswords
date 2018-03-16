import { Component, Input, OnInit } from "@angular/core";
import { GridState, DisplayService } from "../display-service/display.service";

@Component({
    selector: "app-input-letter",
    templateUrl: "./input-letter.component.html",
    styleUrls: ["./input-letter.component.css"]
})
export class InputLetterComponent implements OnInit {
    @Input() public letter: string;
    @Input() public id: number;
    private _gridState: GridState;

    public constructor(private _displayService: DisplayService) {
        this.letter = "	 ";
        this.id = 1;
        this._gridState = new GridState();
    }

    public ngOnInit(): void {
        this._displayService.gridState.subscribe((gridState: GridState) => {
            this._gridState = gridState;
        });
    }

    public select(): void {
        this._displayService.setSelectedLetter(this.id);
    }

    public isDisabled(): boolean {
        return this._gridState.disabledLetters.indexOf(this.id) > -1;
    }

    public isHovered(): boolean {
        return this._gridState.hoveredLetters.indexOf(this.id) > -1;
    }

    public isHighlighted(): boolean {
        return this._gridState.highlightedLetters.indexOf(this.id) > -1;
    }

    public isCurrentLetter(): boolean {
        return this._gridState.currentLetter === this.id;
    }

    public isPlayer1(): boolean {
        return this._gridState.currentPlayer === 1;
    }

    public isPlayer2(): boolean {
        // tslint:disable-next-line:no-magic-numbers
        return this._gridState.currentPlayer === 2;
    }
}
