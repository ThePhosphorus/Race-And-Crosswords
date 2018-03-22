import { Component, OnInit } from "@angular/core";
import { Timer } from "./timer";
import { GameManagerService, CarInfos } from "../game-component/game-manager-service/game_manager.service";

@Component({
    selector: "app-hud",
    templateUrl: "./hud.component.html",
    styleUrls: ["./hud.component.css"]
})
export class HudComponent implements OnInit {
    private globalTimer: Timer;
    private lapTimer: Timer;

    public constructor(private gameManagerService: GameManagerService) {
        this.globalTimer = new Timer();
        this.lapTimer = new Timer();

    }

    public ngOnInit(): void {
        this.startChronometer();
        this.gameManagerService.hudLapReset.subscribe(() => this.lapTimer.reset());
    }

    public get carInfos(): CarInfos {
        return this.gameManagerService.playerInfos;
    }

    private startChronometer(): void {
        this.gameManagerService.hudTimer.subscribe((t: number) => {
            this.lapTimer.update(t);
            this.globalTimer.update(t);

        });

    }

}
