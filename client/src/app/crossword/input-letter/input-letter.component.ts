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

    public isCurrentLetter(): boolean {
        return this._gridState.LIsCurrentLetter(this.id);
    }
    public get playerCSS(): {} {
        const players: Array<PlayerId> = this._crosswordService.getLetterDisabledPlayers(this.id);
        if (players.length === 0) {
            return this.playerHiglightCSS;
        }
        const color: string = this._crosswordService.getPlayerColor(players[0], true);

        return {
            "color": color,
            "border-style": "dotted",
            "box-shadow": "0vmin 0vmin 0vmin 0.4vmin " + color + ",inset 0vmin 0vmin 1.5vmin " + color,
            "background": "linear-gradient(90deg, rgba(255,255,255,0.3) 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 0), #ccc"
        };

    }
    public get playerHiglightCSS(): {} {
        let color: string = "white";
        let bgColor: string = "white";
        const players: Array<PlayerId> = this._crosswordService.getLetterHighlightPlayers(this.id);
        if (players.length === 0) {
            return {};
        } else {
            color = this._crosswordService.getPlayerColor(players[0], true);
            bgColor = this._crosswordService.getPlayerColor(players[0], false);

            return {
                "border-style": "dotted",
                "width": "90%",
                "height": "90%",
                "border-width": "0.2vmin",
                "border-color": color,
                "box-shadow": "0vmin 0vmin 0vmin 0.4vmin " + color + ",inset 0vmin 0vmin 1.5vmin " + color,
                "background-color": bgColor
            };
        }

    }
}
