import { Component, Input, OnInit } from "@angular/core";
import { Players } from "../../../../../common/communication/Player";
import { GridState } from "../grid-state/grid-state";
import { CrosswordService } from "../crossword-service/crossword.service";

@Component({
    selector: "app-input-letter",
    templateUrl: "./input-letter.component.html",
    styleUrls: ["./input-letter.component.css"]
})
export class InputLetterComponent implements OnInit {
    @Input() public letter: string;
    @Input() public id: number;
    private _gridState: GridState;

    public constructor(private _crosswordService: CrosswordService) {
        this.letter = "	 ";
        this.id = 1;
        this._gridState = new GridState();
    }

    public ngOnInit(): void {
        this._crosswordService.gridStateObs.subscribe((gridState: GridState) => {
            this._gridState = gridState;
        });
    }

    public select(): void {
        this._crosswordService.setSelectedLetter(this.id);
    }

    public isDisabled(): boolean {
        return this._gridState.disabledLetters.indexOf(this.id) > -1;
    }

    public isHovered(): boolean {
        return this._gridState.hoveredLetters.indexOf(this.id) > -1;
    }

    public isHighlighted(): boolean {
        return this._gridState.selectedLetters.indexOf(this.id) > -1;
    }

    public isCurrentLetter(): boolean {
        return this._gridState.currentLetter === this.id;
    }

    public isPlayer1(): boolean {
        return this._gridState.currentPlayer === Players.PLAYER1;
    }

    public isPlayer2(): boolean {
        return this._gridState.currentPlayer === Players.PLAYER2;
    }
}
