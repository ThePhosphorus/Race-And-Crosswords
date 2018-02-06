import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { WebGLRenderer, Scene, AmbientLight, GridHelper, Color } from "three";
import { Car } from "../car/car";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { SoundManagerService } from "../sound-manager-service/sound-manager.service";

const GRID_DIMENSION: number = 10000;
const GRID_DIVISIONS: number = 1000;
const GRID_PRIMARY_COLOR: number = 0xFF0000;
const GRID_SECONDARY_COLOR: number = 0x001188;

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.85;

@Injectable()
export class RenderService {
    private container: HTMLDivElement;
    private _car: Car;
    private renderer: WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;
    private gridHelper: GridHelper;
    private _carInfos: CarInfos;

    public constructor(
        private cameraManager: CameraManagerService,
        private soundManager: SoundManagerService
    ) {
        this._car = new Car();
        this._carInfos = new CarInfos(0, 0, 0);
     }

    public get carInfos(): CarInfos {
        return this._carInfos;
     }

    public onResize(): void {
        this.cameraManager.onResize(this.getAspectRatio());
        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        );
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
        this.container = container;

        await this.createScene();

        this.initStats();
        this.startRenderingLoop();
     }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
     }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this._car.update(timeSinceLastFrame);
        this.cameraManager.updatecarInfos(
            this._car.getPosition(),
            this._car.direction
        );
        this.cameraManager.update(timeSinceLastFrame);
        this.lastDate = Date.now();
        this.updateCarInfos();
     }
    private updateCarInfos(): void {
        this._carInfos.speed = this._car.speed.length();
        this._carInfos.gear = this._car.currentGear;
        this._carInfos.rpm = this._car.rpm;
     }
    private async createScene(): Promise<void> {
        this.scene = new Scene();

        await this._car.init();
        this.cameraManager.updatecarInfos(
            this._car.getPosition(),
            this._car.direction
        );
        this.gridHelper = new GridHelper(
            GRID_DIMENSION,
            GRID_DIVISIONS,
            new Color(GRID_PRIMARY_COLOR),
            new Color(GRID_SECONDARY_COLOR)
        );
        this.scene.add(this._car);
        this.scene.add(this.gridHelper);
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.cameraManager.onResize(this.getAspectRatio());
     }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
     }

    private startRenderingLoop(): void {
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        );

        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
     }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this.renderer.render(this.scene, this.cameraManager.camera);
        this.stats.update();
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
