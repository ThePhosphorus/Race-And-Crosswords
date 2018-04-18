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
    public hasStarted: boolean;
    private _timer: number;

    public constructor(private gameManagerService: GameManagerService) {
        this.lights = new Array<boolean>();
        this._timer = 0;
        this.hasStarted = false;

        for (let i: number = 0; i < NUMBER_OF_LIGHTS; i++) {
            this.lights.push(false);
        }
    }

    public ngOnInit(): void {
        this.gameManagerService.subscribeToUpdate((deltaTime: number) => this.update(deltaTime));
    }

    private update(deltaTime: number): void {
        if (!this.hasStarted) {
            this._timer += deltaTime;

            for (let i: number = 0; i < this.lights.length; i++) {
                const lightCheck: boolean = this.lights[i];
                this.lights[i] = this._timer / TIME_BETWEEN_LEDS > i;
                if (this.lights[i] !== lightCheck) {
                    this.gameManagerService.soundManager.playBeep(1);
                }
            }

            if (this._timer > TIME_BETWEEN_LEDS * NUMBER_OF_LIGHTS) {
                this.hasStarted = true;
                this.gameManagerService.startGame();
                this.closeLights();
                this.gameManagerService.soundManager.playBeep(2);
            }
        }
    }

    private closeLights(): void {
        for (let i: number = 0; i < this.lights.length; i++) {
            this.lights[i] = false;
        }
    }

}
