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
    @Input() public letter: string; // TODO: Get object from service and not trough @Input() (We already know the id)
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
        return this._gridState.LIsDisabled(this.id);
    }

    public isHovered(): boolean {
        return this._gridState.LIsHovered(this.id);
    }

    public isHighlighted(): boolean {
        return this._gridState.LIsHighlighted(this.id);
    }

    public isCurrentLetter(): boolean {
        return this._gridState.LIsCurrentLetter(this.id);
    }

    public isPlayer(playerIs: Players): boolean { // TODO: Check What this means
        return this._gridState.currentPlayer === Players.PLAYER1;
    }

    public get playerHiglightCSS(): {} {
        const player: Players = 1;
        const color: string = this.getPlayerColor(player);
        const bgColor: string = this.getBGPlayerColor(player);

        if (player === null) {
            return player;
        }

        return {
            "border-color" : "" + color + " !important",
            "box-shadow" : "0 0 0 0.4vmin " + color + ",inset 0 0 1.5vmin " + color,
            "background-color" : "" + bgColor + "!important;"
        };
    }

    public getPlayerColor(player: Players): string { // TODO: Find a good algo for generating colors
        switch (player) {
            case Players.PLAYER1: return "steelblue";
            case Players.PLAYER2: return "#b46146";
            default:
                return "steelblue";
        }
    }

    public getBGPlayerColor(player: Players): string {
        switch (player) {
            case Players.PLAYER1: return "#b6cee2";
            case Players.PLAYER2: return "#dbb1a3";
            default:
                return "#b6cee2";
        }
    }
}
