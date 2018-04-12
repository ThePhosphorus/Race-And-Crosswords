import { Component, OnInit } from "@angular/core";
import { Highscore } from "../../../../../../common/race/highscore";
import { TrackLoaderService } from "../../track-loader/track-loader.service";
import { ActivatedRoute } from "@angular/router";
import { Track } from "../../../../../../common/race/track";

@Component({
  selector: "app-highscore",
  templateUrl: "./highscore.component.html",
  styleUrls: ["./highscore.component.css"]
})

export class HighscoreComponent implements OnInit {
  public highscores: Array<Highscore>;

  public constructor(private _trackLoader: TrackLoaderService,
                     private _route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this._route.params.map((p) => p.id).subscribe((id: string) => this.loadHighscores(id));

  }
  private loadHighscores(id: string): void {
    this._trackLoader.loadOne(id).subscribe((track: Track) => {
      this.highscores = track.highscores ? track.highscores : new Array<Highscore>();
    });
  }
}
