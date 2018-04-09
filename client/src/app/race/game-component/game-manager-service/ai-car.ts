import { Car } from "../car/car";
import { AIController } from "../ai-controller/ai-controller";
import { Vector3 } from "three";
import { LoaderService } from "../loader-service/loader.service";
import { LoadedObject } from "../loader-service/load-types.enum";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";

export class AICar {
    private aiController: AIController;

    public constructor(public car: Car) {
        this.aiController = new AIController();
    }

    public init(
        position: Vector3,
        loader: LoaderService,
        type: LoadedObject,
        track: Array<Vector3>,
        cameraManager: CameraManagerService
    ): void {
        this.car.add(this.aiController);
        this.car.init(position, loader, type, cameraManager);
        this.aiController.init(track);
    }

    public update(deltaTime: number): void {
        this.aiController.update(deltaTime);
        this.car.update(deltaTime);
    }
}
