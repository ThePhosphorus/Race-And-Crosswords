import { Injectable } from "@angular/core";
import { GridHelper, Color } from "three";
import { Car } from "../car/car";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { Renderer } from "../renderer/renderer";

const GRID_DIMENSION: number = 10000;
const GRID_DIVISIONS: number = 1000;
const GRID_PRIMARY_COLOR: number = 0xFF0000;
const GRID_SECONDARY_COLOR: number = 0x001188;

@Injectable()
export class RenderService extends Renderer {
    private _car: Car;
    private gridHelper: GridHelper;
    private _carInfos: CarInfos;

    public constructor(private cameraManager: CameraManagerService) {
        super(cameraManager, true);
        this._car = new Car();
        this._carInfos = new CarInfos(0, 0, 0);
     }

    public get carInfos(): CarInfos {
        return this._carInfos;
     }

    public handleCarInputsDown(carControls: CarControls): void {
        switch (carControls) {
            case CarControls.Accelerate:
                this._car.isAcceleratorPressed = true;
                break;
            case CarControls.Brake:
                this._car.brake();
                break;
            case CarControls.Left:
                this._car.steerLeft();
                break;
            case CarControls.Right:
                this._car.steerRight();
                break;
            default:
                break;
        }
     }

    public handleCarInputsUp(carControls: CarControls): void {
        switch (carControls) {
            case CarControls.Accelerate:
                this._car.isAcceleratorPressed = false;
                break;
            case CarControls.Brake:
                this._car.releaseBrakes();
                break;
            case (CarControls.Left):
                this._car.releaseSteering();
                break;
            case (CarControls.Right):
                this._car.releaseSteering();
                break;
            default:
                break;
        }
     }

    public async initialize(container: HTMLDivElement): Promise<void> {
        this.init(container);

        await this._car.init();
        this.cameraManager.updatecarInfos(
            this._car.getPosition(),
            this._car.direction
        );
        this.scene.add(this._car);

        this.startRenderingLoop();
     }

    protected onInit(): void {
        this.gridHelper = new GridHelper(
            GRID_DIMENSION,
            GRID_DIVISIONS,
            new Color(GRID_PRIMARY_COLOR),
            new Color(GRID_SECONDARY_COLOR)
        );
        this.scene.add(this.gridHelper);
    }

    protected update(timeSinceLastFrame: number): void {
        this._car.update(timeSinceLastFrame);
        this.cameraTargetDirection = this._car.direction;
        this.cameraTargetPosition = this._car.getPosition();
        this.updateCarInfos();
     }

    private updateCarInfos(): void {
        this._carInfos.speed = this._car.speed.length();
        this._carInfos.gear = this._car.currentGear;
        this._carInfos.rpm = this._car.rpm;
     }
}

export class CarInfos {
    public constructor(
        public speed: number,
        public gear: number,
        public rpm: number
    ) {}
}

export enum CarControls {
    Accelerate,
    Brake,
    Left,
    Right
}
