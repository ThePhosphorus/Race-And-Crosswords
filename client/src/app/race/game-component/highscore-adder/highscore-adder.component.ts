import { Component, OnInit } from "@angular/core";
import { EndGameService } from "../end-game-service/end-game.service";

@Component({
  selector: "app-highscore-adder",
  templateUrl: "./highscore-adder.component.html",
  styleUrls: ["./highscore-adder.component.css"]
})

export class HighscoreAdderComponent implements OnInit {

  public constructor(private _endGameService: EndGameService) { }

  public ngOnInit(): void {
  }
  public get showHighscoreAdder(): boolean {
    return this._endGameService.displayHighscoreAdder;
  }

  public close(): void {
    this._endGameService.closeHighscoreAdder();
  }
  public addHighscore(name: string): void {
    this._endGameService.addHighscore(name);
    this.close();
  }
}
