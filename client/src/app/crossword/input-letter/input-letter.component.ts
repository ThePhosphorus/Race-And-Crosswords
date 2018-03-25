import { Component, Input, OnInit } from "@angular/core";
import { GridState } from "../grid-state/grid-state";
import { CrosswordService } from "../crossword-service/crossword.service";

@Component({
    selector: "app-input-letter",
    templateUrl: "./input-letter.component.html",
    styleUrls: ["./input-letter.component.css"]
})
export class InputLetterComponent implements OnInit {
    @Input() public id: number;
    private _gridState: GridState;

    public constructor(private _crosswordService: CrosswordService) {
        this.id = 1;
        this._gridState = new GridState();
    }

    public ngOnInit(): void {
        this._crosswordService.gridStateObs.subscribe((gridState: GridState) => {
            this._gridState = gridState;
        });
    }

    public get letter(): string {
        return this._crosswordService.getChar(this.id);
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

    public isSelected(): boolean {
        return this._crosswordService.getLetterHighlightPlayers(this.id).length > 0;
    }
}
