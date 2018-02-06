import Stats = require("stats.js");
import { WebGLRenderer, Scene, Vector3, GridHelper, Color, AmbientLight } from "three";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";

const STARTING_CAMERA_HEIGHT: number = 20;
const CAMERA_STARTING_POSITION: Vector3 = new Vector3(0, STARTING_CAMERA_HEIGHT, 0);
const CAMERA_STARTING_DIRECTION: Vector3 = new Vector3(1, 0, 0);

const GRID_DIMENSION: number = 10000;
const GRID_DIVISIONS: number = 1000;
const GRID_PRIMARY_COLOR: number = 0xFF0000;
const GRID_SECONDARY_COLOR: number = 0x001188;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.85;

export class TrackRenderer {
    private _stats: Stats;
    private _container: HTMLDivElement;
    private _renderer: WebGLRenderer;
    private _scene: Scene;
    private _lastDate: number;
    private _cameraPosition: Vector3;
    private _cameraDirection: Vector3;
    private _gridHelper: GridHelper;

    public constructor(container: HTMLDivElement, private cameraManager: CameraManagerService) {
        this._container = container;
        this.initStats();
        this.createScene();
        this.startRenderingLoop();

    }

    private initStats(): void {
        this._stats = new Stats();
        this._stats.dom.style.position = "absolute";
        this._container.appendChild(this._stats.dom);
        this._cameraDirection = CAMERA_STARTING_DIRECTION;
        this._cameraPosition = CAMERA_STARTING_POSITION;
     }

    public onResize(): void {
        this.cameraManager.onResize(this.getAspectRatio());
        this._renderer.setSize(
            this._container.clientWidth,
            this._container.clientHeight
        );
     }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this._lastDate;
        this.cameraManager.updatecarInfos(
            this._cameraPosition,
            this._cameraDirection
        );
        this.cameraManager.update(timeSinceLastFrame);
        this._lastDate = Date.now();
     }

    private async createScene(): Promise<void> {
        this._scene = new Scene();

        this.cameraManager.updatecarInfos(
            this._cameraPosition,
            this._cameraDirection
        );
        this._gridHelper = new GridHelper(
            GRID_DIMENSION,
            GRID_DIVISIONS,
            new Color(GRID_PRIMARY_COLOR),
            new Color(GRID_SECONDARY_COLOR)
        );
        this._scene.add(this._gridHelper);
        this._scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.cameraManager.onResize(this.getAspectRatio());
     }

    private getAspectRatio(): number {
        return this._container.clientWidth / this._container.clientHeight;
     }

    private startRenderingLoop(): void {
        this._renderer = new WebGLRenderer();
        this._renderer.setPixelRatio(devicePixelRatio);
        this._renderer.setSize(
            this._container.clientWidth,
            this._container.clientHeight
        );

        this._lastDate = Date.now();
        this._container.appendChild(this._renderer.domElement);
        this.render();
     }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this._renderer.render(this._scene, this.cameraManager.camera);
        this._stats.update();
     }

}
