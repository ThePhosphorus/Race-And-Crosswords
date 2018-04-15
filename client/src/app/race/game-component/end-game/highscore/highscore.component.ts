import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EndGameService } from "../end-game-service/end-game.service";
import { StringHighscore } from "../string-highscore";
import { Highscore } from "../../../../../../../common/race/highscore";

@Component({
    selector: "app-highscore",
    templateUrl: "./highscore.component.html",
    styleUrls: ["./highscore.component.css"]
})
// TODO : Highlight the current player
export class HighscoreComponent implements OnInit {
    private _id: string;

    public constructor(private _route: ActivatedRoute,
                       private _endGameService: EndGameService) {
    }

    public ngOnInit(): void {
        this._route.params.map((p) => p.id).subscribe((id: string) => {
            this._id = id;
        });
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
        return "/race/" + this._id;
    }

}
