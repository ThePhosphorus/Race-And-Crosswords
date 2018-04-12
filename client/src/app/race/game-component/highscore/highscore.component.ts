import { Component, OnInit } from "@angular/core";
import { Highscore } from "../../../../../../common/race/highscore";

@Component({
  selector: "app-highscore",
  templateUrl: "./highscore.component.html",
  styleUrls: ["./highscore.component.css"]
})

export class HighscoreComponent implements OnInit {
  public highscores: Array<Highscore>;
  public constructor() {
    this.highscores = new Array<Highscore>();
    for (let i: number = 0; i < 5; i++) {
      this.highscores.push(new Highscore("Player" + i, i));
    }
  }

  public ngOnInit(): void {
  }

}
