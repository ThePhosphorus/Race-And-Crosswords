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
  private time: number;
  private track: Track;
  public constructor() { }

  public ngOnInit(): void {
  }
  public addHighscore(name: string): void {

    if (this.track.highscores == null) {
      this.track.highscores = new Array<Highscore>();
    }
    this.track.highscores.push(new Highscore(name, this.time));
    this.track.highscores.sort((a: Highscore, b: Highscore) => a.time - b.time);
    if ( this.track.highscores.length <= MAX_SAVED_HIGHSCORES) {
      this.track.highscores.pop();
    }
    // TODO: close page
  }

}
