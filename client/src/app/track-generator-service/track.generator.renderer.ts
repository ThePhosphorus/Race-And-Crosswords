import Stats = require("stats.js");
import {
    WebGLRenderer,
    Scene,
    Vector3,
    GridHelper,
    Color,
    AmbientLight,
    Vector2,
    Mesh,
    Geometry,
    Line,
    Object3D
} from "three";
import { CameraManagerService, CameraType, ZoomLimit } from "../camera-manager-service/camera-manager.service";
import {ZOOM_IN_KEYCODE, ZOOM_OUT_KEYCODE} from "../input-manager-service/input-manager.service";
import * as C from "./track.constantes";

const LINE_STR_PREFIX: string = "Line to ";

const MIN_ZOOM: number = 10;
const MAX_ZOOM: number = 100;

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
        this._cameraDirection = C.CAMERA_STARTING_DIRECTION;
        this._cameraPosition = C.CAMERA_STARTING_POSITION;
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
            C.GRID_DIMENSION,
            C.GRID_DIVISIONS,
            new Color(C.GRID_PRIMARY_COLOR),
            new Color(C.GRID_SECONDARY_COLOR)
        );
        this._scene.add(this._gridHelper);
        this._scene.add(new AmbientLight(C.WHITE, C.AMBIENT_LIGHT_OPACITY));
        this.cameraManager.onResize(this.getAspectRatio());
        this.cameraManager.cameraDistanceToCar = C.STARTING_CAMERA_HEIGHT;
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

    public createDot(pos: Vector2, topMesh: Vector3): Mesh {
        const circle: Mesh =  new Mesh(C.SPHERE_GEOMETRY, C.WHITE_MATERIAL);
        circle.position.copy(this.getRelativePosition(pos));
        if (topMesh) { this.createLine(topMesh, circle.position, circle.id); }
        this._scene.add(circle);

        return circle;
     }

    public getRelativePosition(pos: Vector2): Vector3 {
        const htmlElem: HTMLCanvasElement = this._renderer.domElement;
        const cameraClientRatio: Vector2 = new Vector2(
            DOUBLE * this.cameraManager.cameraDistanceToCar * this.getAspectRatio() / htmlElem.clientWidth,
            DOUBLE * this.cameraManager.cameraDistanceToCar / htmlElem.clientHeight
        );

        const clientClickPos: Vector2 = new Vector2(
            pos.x - HALF * htmlElem.clientWidth,
            pos.y - HALF * htmlElem.clientHeight
        );

        return new Vector3(
            clientClickPos.x * cameraClientRatio.x,
            0,
            clientClickPos.y * cameraClientRatio.y
        );
     }

    public getClientPosition(pos: Vector3): Vector2 {
        const htmlElem: HTMLCanvasElement = this._renderer.domElement;

        const cameraClientRatio: Vector2 = new Vector2(
            DOUBLE * this.cameraManager.cameraDistanceToCar * this.getAspectRatio() / htmlElem.clientWidth,
            DOUBLE * this.cameraManager.cameraDistanceToCar / htmlElem.clientHeight
        );

        const clientClickPos: Vector2 = new Vector2(
            pos.x / cameraClientRatio.x,
            pos.z / cameraClientRatio.y
        );

        return new Vector2(
            clientClickPos.x + HALF * htmlElem.clientWidth,
            clientClickPos.y  + HALF * htmlElem.clientHeight
        );
     }

    public removeObject(obj: Mesh, before?: Mesh, after?: Mesh): void {
        const id: number = obj.id;
        this._scene.remove(this._scene.getObjectById(id));
        const line: Object3D = this._scene.getObjectByName(LINE_STR_PREFIX + id);
        if (after) {
            const nextLine: Object3D = this._scene.getObjectByName(LINE_STR_PREFIX + after.id);
            this._scene.remove(nextLine);
        }

        this._scene.remove(line);

        if (before != null && after != null) {
            this.createLine(before.position, after.position, after.id);
        }

     }

    private createLine(from: Vector3, to: Vector3, id: number): void {
        const lineG: Geometry = new Geometry();
        lineG.vertices.push(from);
        lineG.vertices.push(to);
        const line: Line = new Line(lineG);
        line.name = LINE_STR_PREFIX + id;
        this._scene.add(line);
    }
}
