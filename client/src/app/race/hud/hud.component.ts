import { Component, OnInit } from "@angular/core";
import { Timer } from "./timer";
import { GameManagerService, CarInfos } from "../game-component/game-manager-service/game_manager.service";

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
        this.totalLap = 5;

    }

    public ngOnInit(): void {
        this.startChronometer();
        this.gameManagerService.hudLapReset.subscribe(() => this.nextLap());
    }

    public nextLap(): void {
        this._lapTimer.reset();
        this.lapCount++;
    }

    public get carInfos(): CarInfos {
        return this.gameManagerService.playerInfos;
    }

    private startChronometer(): void {
        this.gameManagerService.hudTimer.subscribe((t: number) => {
            this._lapTimer.update(t);
            this._globalTimer.update(t);

        });

    }

}
