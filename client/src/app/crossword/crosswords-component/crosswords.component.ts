import { Component, OnInit } from "@angular/core";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { CrosswordService } from "../crossword-service/crossword.service";
import { GameInfoService } from "../crossword-game-info/game-info-service/game-info.service";

@Component({
    selector: "app-crosswords",
    templateUrl: "./crosswords.component.html",
    styleUrls: ["./crosswords.component.css"],
    providers: [CrosswordCommunicationService, GameInfoService, CrosswordService]
})
export class CrosswordsComponent implements OnInit {
    public loading: boolean;
    public searching: boolean;

    public constructor(private _gameInfo: GameInfoService) {
        this.loading = false;
        this.searching = false;
    }

    public ngOnInit(): void {
        this._gameInfo.showSearching.subscribe((showSearching: boolean) => {
            this.searching = showSearching;
        });
        this._gameInfo.showLoading.subscribe((showLoading: boolean) => {
            this.loading = showLoading;
        });
    }
}
