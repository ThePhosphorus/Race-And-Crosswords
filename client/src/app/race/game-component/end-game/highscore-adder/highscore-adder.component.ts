import { Component, OnInit } from "@angular/core";
import { EndGameService } from "../end-game-service/end-game.service";

@Component({
    selector: "app-highscore-adder",
    templateUrl: "./highscore-adder.component.html",
    styleUrls: ["./highscore-adder.component.css"]
})

export class HighscoreAdderComponent implements OnInit {

    public playerName: string;
    public constructor(private _endGameService: EndGameService) {
        this.playerName = "";
    }

    public ngOnInit(): void {
    }

    public get showHighscoreAdder(): boolean {
        return this._endGameService.displayHighscoreAdder;
    }

    public close(): void {
        this._endGameService.closeHighscoreAdder();
    }

    public addHighscore(): void {
        this._endGameService.addHighscore(this.playerName);
        this.close();
    }
}
