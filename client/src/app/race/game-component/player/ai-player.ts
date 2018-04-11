import { RacePlayer } from "./race-player";
import { AIController } from "../player/ai-controller/ai-controller";
import { Car } from "../car/car";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { Vector3, AudioListener } from "three";
import { LoaderService } from "../loader-service/loader.service";
import { LoadedObject } from "../loader-service/load-types.enum";
import { NB_LAPS } from "../../../global-constants/constants";

export class AiPlayer extends RacePlayer {
    private aiController: AIController;

    public constructor(cameraManager: CameraManagerService) {
        super(new Car());
        this.aiController = new AIController();
    }

    public onInit(
        position: Vector3,
        loader: LoaderService,
        type: LoadedObject,
        audioListener: AudioListener
    ): void {
        this.car.add(this.aiController);
        this.car.init(position, loader, type, audioListener);
        this.car.initCarLights(true);
        this.aiController.init(this.track);
    }

    public onUpdate(deltaTime: number): void {
        this.aiController.update(deltaTime);
        this.car.update(deltaTime);
    }

    public finishRace(): void {
        const avg: number = this.calculateAvgAiTime();
        while (this.lapTimes.length < NB_LAPS + 1) {
            if (this.lapTimes[this.lapTimes.length - 1] > 0) {
                const distance: number = this.track.findDistanceOnTrack(this.car.getPosition());
                const total: number = this.track.trackLength;
                const missingTime: number = (1 - (distance / total)) * avg;
                this.lapTimes[this.lapTimes.length - 1] += missingTime;
            } else {
                if (avg > 0) {
                    this.lapTimes[this.lapTimes.length - 1] = avg;
                }
            }
            this.lapTimes.push(0);
        }
        console.log(this.lapTimes);
    }

    private calculateAvgAiTime(): number {
        let sample: number = 0;
        let totalTime: number = 0;
        for (let i: number = 0; i < this.lapTimes.length - 1; i++) {
            sample++;
            totalTime += this.lapTimes[i];
        }

        return (sample !== 0 ) ? totalTime / sample : 0;
    }
}
