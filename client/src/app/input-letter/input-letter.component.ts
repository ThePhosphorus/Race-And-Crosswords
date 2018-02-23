import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-input-letter",
    templateUrl: "./input-letter.component.html",
    styleUrls: ["./input-letter.component.css"]
})
export class InputLetterComponent implements OnInit {
    @Input() public cheatmode: boolean;
    @Input() public letter: string;
    @Input() public id: number;
    @Input() public currentLetter: number;
    @Input() public highlightedLetters: number[];
    @Input() public hoveredLetters: number[];
    @Input() public disabledLetters: number[];
    @Output() public setSelectedLetter: EventEmitter<number> = new EventEmitter<number>();
    @Output() public advertiseWrittenLetter: EventEmitter<string> = new EventEmitter<string>();

    public constructor() {
        this.letter = "";
    }

    public ngOnInit(): void {

    }

    public select(): void {
        this.setSelectedLetter.emit(this.id);
    }

}
