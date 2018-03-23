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
            color = this._crosswordService.getColorFromPlayer(player, true);
        }
        const bgColor: string = this._crosswordService.getColorFromPlayer(player, false);
        if (player === null) {
            return {};
        }

        return {
            "border-color": color,
            "box-shadow": "0vmin 0vmin 0vmin 0.4vmin " + color + ",inset 0vmin 0vmin 1.5vmin " + color,
            "background-color": bgColor
        };
    }
}
