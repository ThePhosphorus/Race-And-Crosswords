import { Component, Input, OnInit } from "@angular/core";
import { PlayerId } from "../../../../../common/communication/Player";
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
    private _isOtherPlayerSelected: boolean;

    public constructor(private _crosswordService: CrosswordService) {
        this.letter = "	 ";
        this.id = 1;
        this._gridState = new GridState();
        this._isOtherPlayerSelected = false;
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
        return this.playerHiglightCSS !== {};
    }

    public isCurrentLetter(): boolean {
        return this._gridState.LIsCurrentLetter(this.id);
    }

    public get playerHiglightCSS(): {} {
        let color: string = "white";
        let bgColor: string = "white";
        const players: Array<PlayerId> = this._crosswordService.getLetterHighlightPlayers(this.id);
        if (players.length === 0) {

            return {};
        } else if (players.length === 1) {
            color = this._crosswordService.getPlayerColor(players[0], true);
            bgColor = this._crosswordService.getPlayerColor(players[0], false);

            return {
                "border-style" : "dotted",
                "width" : "90%",
                "height" : "90%",
                "border-width": "0.2vmin",
                "border-color": color,
                "box-shadow": "0vmin 0vmin 0vmin 0.4vmin " + color + ",inset 0vmin 0vmin 1.5vmin " + color,
                "background-color": bgColor
            };
        } else {
            bgColor = this._crosswordService.getPlayerColor(players[1], true);
            const secondBgColor: string = this._crosswordService.getPlayerColor(players[1], true);
            const lineGradiant: string = "repeating-linear-gradient(45deg" +
                        bgColor + "25%," + bgColor + "25%," + secondBgColor + "25%," + secondBgColor + "25%);";

            return {
                "border-style" : "dotted",
                "width" : "90%",
                "height" : "90%",
                "border-width": "0.2vmin",
                "border-color" : lineGradiant,
                "background-image": lineGradiant
            };
        }

    }
}
