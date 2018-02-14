import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Letter } from "../../../../common/communication/crossword-grid";

@Component({
    selector: "app-input-letter",
    templateUrl: "./input-letter.component.html",
    styleUrls: ["./input-letter.component.css"]
})
export class InputLetterComponent implements OnInit {
    @Input() public letter: string;
    @Input() public id: number;
    @Input() public currentLetter: number;
    @Input() public highlightedLetters: number[];
    @Output() public setSelectedLetter: EventEmitter<number> = new EventEmitter<number>();

    public constructor() {
        this.letter = "";
    }

    public ngOnInit(): void {

    }

    public select(): void {
        this.setSelectedLetter.emit(this.id);
    }
}
