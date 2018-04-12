import { Component, OnInit } from "@angular/core";
import { Highscore } from "../../../../../../common/race/highscore";
import { TrackLoaderService } from "../../track-loader/track-loader.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-highscore-adder",
  templateUrl: "./highscore-adder.component.html",
  styleUrls: ["./highscore-adder.component.css"]
})

export class HighscoreAdderComponent implements OnInit {
  private _time: number;
  private _id: string;
  public constructor(private _trackLoader: TrackLoaderService,
                     private _route: ActivatedRoute) { }

  public ngOnInit(): void {
    this._route.params.map((p) => p.id).subscribe((id: string) => {
      this._id = id;
    });
  }
  public addHighscore(name: string): void {

    this._trackLoader.updateHighScore(this._id, new Highscore(name, this._time));
    // TODO: close page
  }

}
