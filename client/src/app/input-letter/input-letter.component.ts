import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

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
    @Input() public hoveredLetters: number[];
    @Input() public disabledLetters: number[];
    @Input() public currentPlayer: number;
    @Output() public setSelectedLetter: EventEmitter<number> = new EventEmitter<number>();

    public constructor() {
        this.letter = "	 ";
        this.currentLetter = null;
        this.highlightedLetters = [];
        this.hoveredLetters = [];
        this.disabledLetters = [];
        this.currentPlayer = 1;
        this.id = 1;
    }

    public ngOnInit(): void {

    }

    public select(): void {
        this.setSelectedLetter.emit(this.id);
    }

}
