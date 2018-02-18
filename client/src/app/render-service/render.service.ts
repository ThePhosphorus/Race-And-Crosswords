import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    WebGLRenderer,
    Scene,
    AmbientLight,
    Texture,
    Mesh,
    TextureLoader,
    RepeatWrapping,
    MeshLambertMaterial,
    DoubleSide,
    PlaneGeometry
} from "three";
import { Car } from "../car/car";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";

const FLOOR_DIMENSION: number = 10000;
const SPAWN_DIMENSION: number = 100;
const FLOOR_TEXTURE_RATIO: number = 0.1;
const OUT_OF_BOUNDS_Z_TRANSLATION: number = 0.1;

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
    private _carInfos: CarInfos;

    public constructor(private cameraManager: CameraManagerService) {
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

    private getFloor(): Mesh {
        const texture: Texture = new TextureLoader().load("../../assets/textures/OutOfBounds.jpg");
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(FLOOR_DIMENSION * FLOOR_TEXTURE_RATIO, FLOOR_DIMENSION * FLOOR_TEXTURE_RATIO);
        const material: MeshLambertMaterial = new MeshLambertMaterial({ map: texture, side: DoubleSide });
        const plane: Mesh = new Mesh(new PlaneGeometry(FLOOR_DIMENSION, FLOOR_DIMENSION), material);
        plane.rotateX(Math.PI / 2);
        plane.translateZ(OUT_OF_BOUNDS_Z_TRANSLATION);

        return plane;
    }

    private getTrack(): Mesh {
        const texture: Texture = new TextureLoader().load("../../assets/textures/floor.jpg");
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(SPAWN_DIMENSION * FLOOR_TEXTURE_RATIO, SPAWN_DIMENSION * FLOOR_TEXTURE_RATIO);
        const material: MeshLambertMaterial = new MeshLambertMaterial({ map: texture, side: DoubleSide });
        const plane: Mesh = new Mesh(new PlaneGeometry(SPAWN_DIMENSION, SPAWN_DIMENSION), material);
        plane.rotateX(Math.PI / 2);

        return plane;
    }

    private async createScene(): Promise<void> {
        this.scene = new Scene();

        await this._car.init();
        this.cameraManager.updatecarInfos(
            this._car.getPosition(),
            this._car.direction
        );
        this.scene.add(this._car);
        this.scene.add(this.getFloor());
        this.scene.add(this.getTrack());
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
    ) { }
}

export enum CarControls {
    Accelerate,
    Brake,
    Left,
    Right
}
