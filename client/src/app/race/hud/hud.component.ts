import { Component, OnInit } from "@angular/core";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Subscription } from "rxjs/Subscription";
import { Timer } from "./timer";
import { GameManagerService, CarInfos } from "../game-component/game-manager-service/game_manager.service";
import { TWO_SECONDS, CENTISECOND } from "../../global-constants/constants";
import { Observable } from "rxjs/Observable";

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
        // tslint:disable-next-line:no-magic-numbers
        // tslint:disable-next-line:typedef
        this.gameManagerService.hud.subscribe((t: number) => {
            this.lapTimer.update(t);
            this.globalTimer.update(t);

        });

    }

    }
