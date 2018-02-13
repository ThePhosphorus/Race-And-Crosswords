import { Component, OnInit, Input } from "@angular/core";
import { Letter } from "../../../../common/communication/crossword-grid";

@Component({
    selector: "app-input-letter",
    templateUrl: "./input-letter.component.html",
    styleUrls: ["./input-letter.component.css"]
})
export class InputLetterComponent implements OnInit {
    @Input() public letter: Letter;

    public constructor() {
        this.letter = new Letter("");
    }

    public ngOnInit(): void {

    }

}
