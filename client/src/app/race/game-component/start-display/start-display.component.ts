import { Component, OnInit } from "@angular/core";
import { GameManagerService } from "../game-manager-service/game_manager.service";

const NUMBER_OF_LIGHTS: number = 3;
const TIME_BETWEEN_LEDS: number = 1000;

@Component({
    selector: "app-start-display",
    templateUrl: "./start-display.component.html",
    styleUrls: ["./start-display.component.css"]
})
export class StartDisplayComponent implements OnInit {

    public lights: Array<boolean>;
    private _timer: number;
    private _hasStarted: boolean;

    public constructor(private gameManagerService: GameManagerService) {
        this.lights = new Array<boolean>();
        this._timer = 0;
        this._hasStarted = false;

        for (let i: number = 0; i < NUMBER_OF_LIGHTS; i++) {
            this.lights.push(false);
        }
    }

    public ngOnInit(): void {
        this.gameManagerService.subscribeToUpdate((deltaTime: number) => this.update(deltaTime));
    }

    private update(deltaTime: number): void {
        if (!this._hasStarted) {
            this._timer += deltaTime;
            if (this._timer > 1) {
                this.gameManagerService.soundManager.playStartingSound();
            }

            for (let i: number = 0; i < this.lights.length; i++) {
                this.lights[i] = this._timer / TIME_BETWEEN_LEDS > i;
            }

            if (this._timer > TIME_BETWEEN_LEDS * NUMBER_OF_LIGHTS) {
                this._hasStarted = true;
                this.gameManagerService.startGame();
                this.closeLights();
            }
        }
    }

    private closeLights(): void {
        for (let i: number = 0; i < this.lights.length; i++) {
            this.lights[i] = false;
        }
    }

}
