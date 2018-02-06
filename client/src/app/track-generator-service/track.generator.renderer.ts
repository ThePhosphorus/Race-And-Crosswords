import Stats = require("stats.js");
import {
    WebGLRenderer,
    Scene,
    Vector3,
    GridHelper,
    Color,
    AmbientLight,
    Vector2,
    MeshBasicMaterial,
    Mesh,
    SphereGeometry
} from "three";
import { CameraManagerService, CameraType, ZoomLimit } from "../camera-manager-service/camera-manager.service";
import {ZOOM_IN_KEYCODE, ZOOM_OUT_KEYCODE} from "../input-manager-service/input-manager.service";
import { Vector2 } from "three";

const STARTING_CAMERA_HEIGHT: number = 60;
const CAMERA_STARTING_POSITION: Vector3 = new Vector3(0, STARTING_CAMERA_HEIGHT, 0);
const CAMERA_STARTING_DIRECTION: Vector3 = new Vector3(0, -1, 0);

const GRID_DIMENSION: number = 10000;
const GRID_DIVISIONS: number = 1000;
const GRID_PRIMARY_COLOR: number = 0xFF0000;
const GRID_SECONDARY_COLOR: number = 0x001188;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.85;

const MIN_ZOOM: number = 10;
const MAX_ZOOM: number = 100;

const SPHERE_GEOMETRY: SphereGeometry = new SphereGeometry(5, 32, 32);
const SPHERE_MESH_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial ({color: WHITE});

const HALF: number = 0.5;
const DOUBLE: number = 2;

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

    private createScene(): void {
        this._scene = new Scene();

        this.cameraManager.updatecarInfos(
            this._cameraPosition,
            this._cameraDirection
        );
        this.cameraManager.cameraType = CameraType.Ortho;
        this._gridHelper = new GridHelper(
            GRID_DIMENSION,
            GRID_DIVISIONS,
            new Color(GRID_PRIMARY_COLOR),
            new Color(GRID_SECONDARY_COLOR)
        );
        this._scene.add(this._gridHelper);
        this._scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.cameraManager.onResize(this.getAspectRatio());
        this.cameraManager.cameraDistanceToCar = STARTING_CAMERA_HEIGHT;
        this.cameraManager.zoomLimits = new ZoomLimit(MIN_ZOOM, MAX_ZOOM);
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

    public InputKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ZOOM_IN_KEYCODE:
                this.cameraManager.zoomIn();
                break;
            case ZOOM_OUT_KEYCODE:
                this.cameraManager.zoomOut();
                break;
            default:
                break;
        }
     }

    public InputKeyUp(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ZOOM_IN_KEYCODE:
                this.cameraManager.zoomRelease();
                break;
            case ZOOM_OUT_KEYCODE:
                this.cameraManager.zoomRelease();
                break;
            default:
                break;
        }
     }

    public createDot(pos: Vector2): Mesh {
        const circle: Mesh =  new Mesh(SPHERE_GEOMETRY, SPHERE_MESH_MATERIAL);
        circle.position.copy(this.getRelativePosition(pos));
        this._scene.add(circle);

        return circle;
     }

    private getRelativePosition(pos: Vector2): Vector3 {
        const htmlElem: HTMLCanvasElement = this._renderer.domElement;

        const cameraClientRatio: Vector2 = new Vector2(
            DOUBLE * this.cameraManager.cameraDistanceToCar * this.getAspectRatio() / htmlElem.clientWidth,
            DOUBLE * this.cameraManager.cameraDistanceToCar / htmlElem.clientHeight
        );

        const clientClickPos: Vector2 = new Vector2(
            pos.x - htmlElem.offsetLeft - HALF * htmlElem.clientWidth,
            pos.y - htmlElem.offsetTop - HALF * htmlElem.clientHeight
        );

        return new Vector3(
            clientClickPos.x * cameraClientRatio.x,
            0,
            clientClickPos.y * cameraClientRatio.y
        );
     }
}
