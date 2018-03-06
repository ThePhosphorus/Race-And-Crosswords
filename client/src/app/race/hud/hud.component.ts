import { Component, OnInit } from "@angular/core";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Subscription } from "rxjs/Subscription";
import { Timer } from "./timer";

@Component({
    selector: "app-hud",
    templateUrl: "./hud.component.html",
    styleUrls: ["./hud.component.css"]
})
export class HudComponent implements OnInit {
    public tick: number;
    private globalTimer: Timer;
    private lapTimer: Timer;

    private subscription: Subscription;
    public constructor() {
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

    private start_chron(): void {
        // tslint:disable-next-line:no-magic-numbers
        // tslint:disable-next-line:typedef
        const timer = TimerObservable.create(2000, 10);
        this.subscription = timer.subscribe((t) => {
            this.tick = t;
            this.lapTimer.update();
            this.globalTimer.update();

        });

    }

    }
