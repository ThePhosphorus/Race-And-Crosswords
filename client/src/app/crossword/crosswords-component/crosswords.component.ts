import { Component } from "@angular/core";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { CrosswordService } from "../crossword-service/crossword.service";

@Component({
    selector: "app-crosswords",
    templateUrl: "./crosswords.component.html",
    styleUrls: ["./crosswords.component.css"],
    providers: [CrosswordCommunicationService, CrosswordService]
})
export class CrosswordsComponent {
    public loading: boolean;
    public searching: boolean;

    public constructor() {
        this.loading = true;
        this.searching =true;
    }
}
