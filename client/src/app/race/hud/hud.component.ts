import { Component, OnInit } from "@angular/core";
import { Timer } from "./timer";
import { GameManagerService, CarInfos } from "../game-component/game-manager-service/game_manager.service";

@Component({
    selector: "app-hud",
    templateUrl: "./hud.component.html",
    styleUrls: ["./hud.component.css"]
})
export class HudComponent implements OnInit {
    public tick: number;
    private globalTimer: Timer;
    private lapTimer: Timer;

    public constructor(private gameManagerService: GameManagerService) {
        this.initTick();
        this.globalTimer = new Timer();
        this.lapTimer = new Timer();

    }

    private initTick(): void {
        this.tick = 0;
    }

    public ngOnInit(): void {
        this.start_chron();
    }

    public get carInfos(): CarInfos {
        return this.gameManagerService.playerInfos;
    }

    private start_chron(): void {
        this.gameManagerService.hud.subscribe((t: number) => {
            this.lapTimer.update(t);
            this.globalTimer.update(t);

        });

    }

}
