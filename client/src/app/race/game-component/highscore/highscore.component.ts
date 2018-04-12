import { Component, OnInit } from "@angular/core";
import { Highscore } from "../../../../../../common/race/highscore";
import { TrackLoaderService } from "../../track-loader/track-loader.service";
import { ActivatedRoute} from "@angular/router";
import { Track } from "../../../../../../common/race/track";
import { EndGameService } from "../end-game-service/end-game.service";

@Component({
  selector: "app-highscore",
  templateUrl: "./highscore.component.html",
  styleUrls: ["./highscore.component.css"]
})

export class HighscoreComponent implements OnInit {
  private _highscores: Array<Highscore>;
  private _id: string;

  public constructor(private _trackLoader: TrackLoaderService,
                     private _route: ActivatedRoute,
                     private _endGameService: EndGameService) {
  }
  public ngOnInit(): void {
    this._route.params.map((p) => p.id).subscribe((id: string) => {
      this.loadHighscores(id);
      this._id = id;
    });
  }
  public get showHighscoreComponent(): boolean {
    return this._endGameService.displayHighscore;
  }
  public get highscores(): Array<Highscore> {
    return this._highscores;
  }
  public get route(): string {
    return "/race/" + this._id;
  }

  private loadHighscores(id: string): void {
    this._trackLoader.loadOne(id).subscribe((track: Track) => {
      this._highscores = track.highscores ? track.highscores : new Array<Highscore>();
    });
  }
}
