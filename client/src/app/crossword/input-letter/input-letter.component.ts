import { Component, Input, OnInit } from "@angular/core";
import { PlayerId } from "../../../../../common/communication/Player";
import { GridState } from "../grid-state/grid-state";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Color } from "three";

const RED_IN_STEELBLUE: number = 70;
const BLUE_IN_STEELBLUE: number = 180;
const GREEN_IN_STEELBLUE: number = 130;
const RED_IN_ORANGE: number = 180;
const BLUE_IN_ORANGE: number = 70;
const GREEN_IN_ORANGE: number = 97;

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

    public get playerHiglightCSS(): {} {
        const player: PlayerId = this._crosswordService.getLetterHighlightPlayer(this.id);
        const color: string = this.getPlayerColor(player);
        const bgColor: string = this.getBGPlayerColor(player);

        if (player === null) {
            return {};
        }

        return {
            "border-color": "" + color + " !important",
            "box-shadow": "0 0 0 0.4vmin " + color + ",inset 0 0 1.5vmin " + color + "!important;",
            "background-color": "" + bgColor + "!important;"
        };
    }

    public getPlayerColor(player: PlayerId): string { // TODO: Find a good algo for generating colors
        if (this._crosswordService.players.getValue().length > 0) {
            const ratio: number = player / (this._crosswordService.players.getValue().length - 1);
        }
        const red: number = RED_IN_STEELBLUE + (ratio * (RED_IN_ORANGE - RED_IN_STEELBLUE));
        const blue: number = BLUE_IN_STEELBLUE + (ratio * (BLUE_IN_ORANGE - BLUE_IN_STEELBLUE));
        const green: number = GREEN_IN_STEELBLUE + (ratio * (GREEN_IN_ORANGE - GREEN_IN_STEELBLUE));

        return "rgb" + "(" + red + "," + green + "," + blue + ")";
    }

    public getBGPlayerColor(player: PlayerId): string {
        switch (player) {
            case PlayerId.PLAYER1: return "#b6cee2";
            case PlayerId.PLAYER2: return "#dbb1a3";
            default:
                return "#b6cee2";
        }
    }
}
