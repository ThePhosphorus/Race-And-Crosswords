import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EndGameService } from "../end-game-service/end-game.service";
import { StringHighscore } from "../string-highscore";

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
        return this._endGameService.trackHighscores;
    }

    public get route(): string {
        return "/race/" + this._id;
    }

}
