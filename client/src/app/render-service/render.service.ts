import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    WebGLRenderer,
    Scene,
    AmbientLight,
    Vector3,
    GridHelper,
    Color
} from "three";
import { Car } from "../car/car";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";

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

    public constructor(private cameraManager: CameraManagerService) {
        this._car = new Car();
     }

    public get car(): Car {
        return this._car;
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
        this.cameraManager.updatecarInfos(this._car.getPosition(), this._car.direction);
        this.cameraManager.update(timeSinceLastFrame);
        this.lastDate = Date.now();
     }
    private async createScene(): Promise<void> {
        this.scene = new Scene();

        await this._car.init();
        this.cameraManager.updatecarInfos(this._car.getPosition(), this._car.direction);
        this.gridHelper = new GridHelper(
            GRID_DIMENSION, GRID_DIVISIONS,
            new Color(GRID_PRIMARY_COLOR), new Color(GRID_SECONDARY_COLOR));
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
        this.renderer.render(this.scene , this.cameraManager.camera);
        this.stats.update();
     }

    public onResize(): void {
        this.cameraManager.onResize(this.getAspectRatio());
        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        );
     }

    public get carPosition(): Vector3 {
        return this._car.getPosition();
     }

}
