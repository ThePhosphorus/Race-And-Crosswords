import { Component } from "@angular/core";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { CrosswordService } from "../crossword-service/crossword.service";
import { DisplayService } from "../display-service/display.service";

@Component({
    selector: "app-crosswords",
    templateUrl: "./crosswords.component.html",
    styleUrls: ["./crosswords.component.css"],
    providers: [CrosswordCommunicationService, CrosswordService, DisplayService]
})
export class CrosswordsComponent {
    public constructor() {
    }
}
