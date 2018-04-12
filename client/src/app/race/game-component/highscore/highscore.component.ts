import { Component, OnInit } from "@angular/core";
import { Highscore } from "../../../../../../common/race/highscore";
import { TrackLoaderService } from "../../track-loader/track-loader.service";
import { ActivatedRoute} from "@angular/router";
import { EndGameService } from "../end-game-service/end-game.service";

@Component({
  selector: "app-highscore",
  templateUrl: "./highscore.component.html",
  styleUrls: ["./highscore.component.css"]
})

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
  public get highscores(): Array<Highscore> {
    return this._endGameService.trackHighscores;
  }
  public get route(): string {
    return "/race/" + this._id;
  }

}
