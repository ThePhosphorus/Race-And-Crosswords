import { RacePlayer } from "./player";
import { Car } from "../car/car";
import { Vector3 } from "three";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { InputManagerService } from "../../input-manager-service/input-manager.service";
import { ACCELERATE_KEYCODE, BRAKE_KEYCODE, LEFT_KEYCODE, RIGHT_KEYCODE, HANDBRAKE_KEYCODE } from "../../../global-constants/constants";

export class UserPlayer extends RacePlayer {
    public constructor(cameraManager: CameraManagerService, private inputManager: InputManagerService) {
        super(new Car(cameraManager));
    }

    public async init(position: Vector3, color: string): Promise<void> {
        this.initKeyBindings();
        await this.car.init(position, color);
    }

    public update(deltaTime: number): void {
        this.car.update(deltaTime);
    }

    private initKeyBindings(): void {
        this.inputManager.registerKeyDown(ACCELERATE_KEYCODE, () => this.car.carControl.accelerate());
        this.inputManager.registerKeyDown(BRAKE_KEYCODE, () => this.car.carControl.brake());
        this.inputManager.registerKeyDown(LEFT_KEYCODE, () => this.car.carControl.steerLeft());
        this.inputManager.registerKeyDown(RIGHT_KEYCODE, () => this.car.carControl.steerRight());
        this.inputManager.registerKeyDown(HANDBRAKE_KEYCODE, () => this.car.carControl.handBrake());
        this.inputManager.registerKeyUp(ACCELERATE_KEYCODE, () => this.car.carControl.releaseAccelerator());
        this.inputManager.registerKeyUp(BRAKE_KEYCODE, () => this.car.carControl.releaseBrakes());
        this.inputManager.registerKeyUp(LEFT_KEYCODE, () => this.car.carControl.releaseSteeringLeft());
        this.inputManager.registerKeyUp(RIGHT_KEYCODE, () => this.car.carControl.releaseSteeringRight());
        this.inputManager.registerKeyUp(HANDBRAKE_KEYCODE, () => this.car.carControl.releaseHandBrake());
    }
}
