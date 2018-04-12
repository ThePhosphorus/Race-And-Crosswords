import { Component, OnInit } from "@angular/core";
import { Highscore } from "../../../../../../common/race/highscore";
import { TrackLoaderService } from "../../track-loader/track-loader.service";
import { ActivatedRoute} from "@angular/router";
import { Track } from "../../../../../../common/race/track";

@Component({
  selector: "app-highscore",
  templateUrl: "./highscore.component.html",
  styleUrls: ["./highscore.component.css"]
})

export class HighscoreComponent implements OnInit {
  private _highscores: Array<Highscore>;
  private _id: string;

  public constructor(private _trackLoader: TrackLoaderService,
                     private _route: ActivatedRoute) {
  }
  public get highscores(): Array<Highscore> {
    return this._highscores;
  }
  public get route(): string {
    return "/race/" + this._id;
  }
  public ngOnInit(): void {
    this._route.params.map((p) => p.id).subscribe((id: string) => {
      this.loadHighscores(id);
      this._id = id;
    });

  }
  private loadHighscores(id: string): void {
    this._trackLoader.loadOne(id).subscribe((track: Track) => {
      this._highscores = track.highscores ? track.highscores : new Array<Highscore>();
    });
  }
}
