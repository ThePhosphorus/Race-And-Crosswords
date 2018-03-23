import { Component, Input, OnInit } from "@angular/core";
import { PlayerId } from "../../../../../common/communication/Player";
import { GridState } from "../grid-state/grid-state";
import { CrosswordService } from "../crossword-service/crossword.service";

const RED_IN_STEELBLUE: number = 70;
const BLUE_IN_STEELBLUE: number = 180;
const GREEN_IN_STEELBLUE: number = 130;

const RED_IN_ORANGE: number = 180;
const BLUE_IN_ORANGE: number = 70;
const GREEN_IN_ORANGE: number = 97;

const RED_IN_BGBLUE: number = 182;
const BLUE_IN_BGBLUE: number = 226;
const GREEN_IN_BGBLUE: number = 206;

const RED_IN_BGORANGE: number = 219;
const BLUE_IN_BGORANGE: number = 163;
const GREEN_IN_BGORANGE: number = 177;
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
        let color: string = "white";
        const player: PlayerId = this._crosswordService.getLetterHighlightPlayer(this.id);
        if (this.isHighlighted) {
            color = this.getPlayerColor(player);
        }
        const bgColor: string = this.getBGPlayerColor(player);
        if (player === null) {
            return {};
        }

        return {
            "border-color": color,
            "box-shadow": "0vmin 0vmin 0vmin 0.4vmin " + color + ",inset 0vmin 0vmin 1.5vmin " + color,
            "background-color": bgColor
        };
    }

    public getPlayerColor(player: PlayerId): string {
        let ratio: number = this._crosswordService.players.getValue().length;
        if (ratio > 1) {
            ratio = player / (ratio - 1);
        }

        const red: number = Math.round(RED_IN_STEELBLUE + (ratio * (RED_IN_ORANGE - RED_IN_STEELBLUE)));
        const blue: number = Math.round(BLUE_IN_STEELBLUE + (ratio * (BLUE_IN_ORANGE - BLUE_IN_STEELBLUE)));
        const green: number = Math.round (GREEN_IN_STEELBLUE + (ratio * (GREEN_IN_ORANGE - GREEN_IN_STEELBLUE)));

        return ("rgb" + "(" + red.toString() + "," + green.toString() + "," + blue.toString() + ")");
    }

    public getBGPlayerColor(player: PlayerId): string {
        let ratio: number = this._crosswordService.players.getValue().length;
        if (ratio > 1) {
            ratio = player / (ratio - 1);
        }

        const red: number = Math.round(RED_IN_BGBLUE + (ratio * (RED_IN_BGORANGE - RED_IN_BGBLUE)));
        const blue: number = Math.round(BLUE_IN_BGBLUE + (ratio * (BLUE_IN_BGORANGE - BLUE_IN_BGBLUE)));
        const green: number = Math.round(GREEN_IN_BGBLUE + (ratio * (GREEN_IN_BGORANGE - GREEN_IN_BGBLUE)));

        return ("rgb" + "(" + red.toString() + "," + green.toString() + "," + blue.toString() + ")");

    }
}
