import { Component } from "@angular/core";
import { GameManagerService } from "../../game-component/game-manager-service/game_manager.service";
import { METER_TO_KM_SPEED_CONVERSION } from "../../../global-constants/constants";

@Component({
  selector: "app-rpm-bar",
  templateUrl: "./rpm-bar.component.html",
  styleUrls: ["./rpm-bar.component.css"]
})
export class RpmBarComponent {

  public constructor(private _gameManagerService: GameManagerService) { }

  public get speed(): number {
    return Math.round(this._gameManagerService.playerInfos.speed * METER_TO_KM_SPEED_CONVERSION);
  }

  public get gear(): string {
    return this.speed >= 0 ? (this._gameManagerService.playerInfos.gear + 1).toString() : "R";
  }
  public get rpm(): number {
    return Math.round(this._gameManagerService.playerInfos.rpm);
  }
}
