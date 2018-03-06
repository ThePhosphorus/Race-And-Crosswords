import { Component, Input, Output, EventEmitter } from "@angular/core";
import { GridState } from "../display-service/display.service";

@Component({
    selector: "app-input-letter",
    templateUrl: "./input-letter.component.html",
    styleUrls: ["./input-letter.component.css"]
})
export class InputLetterComponent {
    @Input() public letter: string;
    @Input() public id: number;
    @Input() public gridState: GridState;
    @Output() public setSelectedLetter: EventEmitter<number>;

    public constructor() {
        this.letter = "	 ";
        this.id = 1;
        this.gridState = new GridState();
        this.setSelectedLetter = new EventEmitter<number>();
    }

    public select(): void {
        this.setSelectedLetter.emit(this.id);
    }

    public isDisabled(): boolean {
        return this.gridState.disabledLetters.indexOf(this.id) > -1;
    }

    public isHovered(): boolean {
        return this.gridState.hoveredLetters.indexOf(this.id) > -1;
    }

    public isHighlighted(): boolean {
        return this.gridState.highlightedLetters.indexOf(this.id) > -1;
    }
}
