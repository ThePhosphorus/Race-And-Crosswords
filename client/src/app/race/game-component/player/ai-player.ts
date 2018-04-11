import { RacePlayer } from "./race-player";
import { AIController } from "../player/ai-controller/ai-controller";
import { Car } from "../car/car";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { Vector3, AudioListener } from "three";
import { LoaderService } from "../loader-service/loader.service";
import { LoadedObject } from "../loader-service/load-types.enum";
import { TrackPosition } from "./track-position/track-position";

export class AiPlayer extends RacePlayer {
    private aiController: AIController;

    public constructor(cameraManager: CameraManagerService) {
        super(new Car());
        this.aiController = new AIController();
    }

    public init(
        position: Vector3,
        loader: LoaderService,
        type: LoadedObject,
        audioListener: AudioListener,
        track: TrackPosition
    ): void {
        this.car.add(this.aiController);
        this.car.init(position, loader, type, audioListener);
        this.car.initCarLights(true);
        this.aiController.init(track);
        this.track = track;
    }

    public update(deltaTime: number): void {
        this.aiController.update(deltaTime);
        this.car.update(deltaTime);
    }
}
