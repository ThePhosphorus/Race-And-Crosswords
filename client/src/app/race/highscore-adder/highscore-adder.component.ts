import { Component, OnInit } from "@angular/core";
import { Highscore } from "../../../../../common/race/highscore";
import { Track } from "../../../../../common/race/track";

@Component({
  selector: "app-highscore-adder",
  templateUrl: "./highscore-adder.component.html",
  styleUrls: ["./highscore-adder.component.css"]
})

const MAX_SAVED_HIGHSCORES: number = 5;

export class HighscoreAdderComponent implements OnInit {

  private highscore: Highscore;
  private track: Track;
  public constructor() { }

  public ngOnInit() {
  }
  private addHighscore(): void {

    if (this.track.highscores == null) {
      this.track.highscores = new Array<Highscore>();
    }
    if ( this.track.highscores.length <= MAX_SAVED_HIGHSCORES) {
      this.track.highscores.push();
    }

}
