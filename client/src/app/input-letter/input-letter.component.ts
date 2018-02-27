import { Component, Input, Output, EventEmitter } from "@angular/core";
import { GridState } from "../input-grid/input-grid.component";

@Component({
    selector: "app-input-letter",
    templateUrl: "./input-letter.component.html",
    styleUrls: ["./input-letter.component.css"]
})
export class InputLetterComponent {
    @Input() public letter: string;
    @Input() public id: number;
    @Input() public gridState: GridState;
    @Output() public setSelectedLetter: EventEmitter<number> = new EventEmitter<number>();

    public constructor() {
        this.letter = "	 ";
        this.id = 1;
        this.gridState = new GridState();
    }

    public select(): void {
        this.setSelectedLetter.emit(this.id);
    }
}
