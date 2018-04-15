import { Component } from "@angular/core";
import { EndGameService } from "../end-game-service/end-game.service";
import { StringHighscore } from "../string-highscore";
import { Highscore } from "../../../../../../../common/race/highscore";
import { Router } from "@angular/router";

@Component({
    selector: "app-highscore",
    templateUrl: "./highscore.component.html",
    styleUrls: ["./highscore.component.css"]
})
// TODO : Highlight the current player
export class HighscoreComponent {

    public constructor( private _router: Router,
                        private _endGameService: EndGameService) {
    }

    public get showHighscoreComponent(): boolean {
        return this._endGameService.displayHighscore;
    }

    public get highscores(): Array<StringHighscore> {
        const stringHighscores: Array<StringHighscore> = new Array<StringHighscore>();
        this._endGameService.trackHighscores.forEach((hs: Highscore) => stringHighscores.push(new StringHighscore(hs)));

        return stringHighscores;
    }

    public get route(): string {
        return this._router.url;
    }
}
