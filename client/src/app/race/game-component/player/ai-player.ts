import { RacePlayer } from "./race-player";
import { AIController } from "../ai-controller/ai-controller";
import { Car } from "../car/car";
import { Vector3 } from "three";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";

export class AiPlayer extends RacePlayer {
    private aiController: AIController;
    private track: Array<Vector3>;

    public constructor(cameraManager: CameraManagerService, track: Array<Vector3>) {
        super(new Car(cameraManager));
        this.aiController = new AIController();
        this.track = track;
    }

    public async init(position: Vector3, color: string): Promise<void> {
        this.car.add(this.aiController);
        await this.car.init(position, color);
        this.aiController.init(this.track);
    }

    public update(deltaTime: number): void {
        this.aiController.update(deltaTime);
        this.car.update(deltaTime);
    }
}
