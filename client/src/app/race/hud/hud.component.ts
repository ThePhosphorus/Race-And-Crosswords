import { Component, OnInit } from "@angular/core";
import { Timer } from "./timer";
import { GameManagerService } from "../game-component/game-manager-service/game_manager.service";
import { NB_LAPS } from "../../global-constants/constants";

@Component({
    selector: "app-hud",
    templateUrl: "./hud.component.html",
    styleUrls: ["./hud.component.css"]
})
export class HudComponent implements OnInit {
    private _globalTimer: Timer;
    private _lapTimer: Timer;
    public lapCount: number;
    public totalLap: number;

    public constructor(private gameManagerService: GameManagerService) {
        this._globalTimer = new Timer();
        this._lapTimer = new Timer();
        this.lapCount = 1;
        this.totalLap = NB_LAPS;

    }

    public ngOnInit(): void {
        this.gameManagerService.subscribeToUpdate((deltaTime: number) => this.update(deltaTime));
    }

    public nextLap(): void {
        this._lapTimer.reset();
        this.lapCount++;
    }

    public get globalTimer(): Timer {
        return this._globalTimer;
    }

    public get lapTimer(): Timer {
        return this._lapTimer;
    }

    private update(deltaTime: number): void {
        if (this.gameManagerService.isStarted) {
            this._lapTimer.update(deltaTime);
            this._globalTimer.update(deltaTime);
            if (this.gameManagerService.playerInfos.lap > this.lapCount && this.lapCount < this.totalLap) {
                this.nextLap();
            }
        }
    }
}
