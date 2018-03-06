import { Component, OnInit } from "@angular/core";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: "app-hud",
    templateUrl: "./hud.component.html",
    styleUrls: ["./hud.component.css"]
})
export class HudComponent implements OnInit {
    public tick: number;
    public minutes: number;
    public seconds: number;
    public centiseconds: number;
    private subscription: Subscription;
    public constructor() {
        this.tick = 0;
        this.centiseconds = 0;
        this.minutes = 0;
        this.seconds = 0;
    }

    public ngOnInit() {
        this.start_chron();
    }

    private start_chron(): void {
        // tslint:disable-next-line:no-magic-numbers
        // tslint:disable-next-line:typedef
        const timer = TimerObservable.create(2000, 10);
        this.subscription = timer.subscribe((t) => {
            this.tick = t;
            this.centiseconds++;
            if (this.centiseconds >= 100) {
                this.centiseconds = 0;
                this.seconds++;
                if (this.seconds >= 60) {
                    this.seconds = 0;
                    this.minutes++;
                }

            }
        });

    }

    private divideTime(): void {

    }
