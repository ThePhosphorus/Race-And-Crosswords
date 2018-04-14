import { Component, OnInit } from "@angular/core";
import { EndGameService } from "../end-game-service/end-game.service";

@Component({
  selector: "app-game-result-component",
  templateUrl: "./game-result-component.component.html",
  styleUrls: ["./game-result-component.component.css"]
})
export class GameResultComponentComponent implements OnInit {

  public constructor(public endGameService: EndGameService) {}

  public ngOnInit(): void {}

}
