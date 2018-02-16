import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { WebGLRenderer, Scene, AmbientLight, Vector2, Vector3 } from "three";
import Stats = require("stats.js");
import * as C from "../track-generator-service/track.constantes";

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.85;

const HALF: number = 0.5;
const DOUBLE: number = 2;

export abstract class Renderer {
    private _container: HTMLDivElement;
    private _webGlRenderer: WebGLRenderer;
    private _scene: Scene;
    private _lastDate: number;
    private _stats: Stats;
    private _cameraManager: CameraManagerService;
    protected cameraTargetPosition: Vector3;
    protected cameraTargetDirection: Vector3;

    public constructor( cameraManager: CameraManagerService, private statsEnabled: boolean) {
        this._cameraManager = cameraManager;
    }

    public init(container: HTMLDivElement): void {
        this._container = container;
        this.cameraTargetDirection = C.CAMERA_STARTING_DIRECTION;
        this.cameraTargetPosition = C.CAMERA_STARTING_POSITION;

        this.initStats();
        this.createScene();
        this._cameraManager.updatecarInfos(
            this.cameraTargetPosition,
            this.cameraTargetDirection
        );
        this.onInit();
     }

    public onResize(): void {
        this._cameraManager.onResize(this.getAspectRatio());
        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        );
     }

    public startRenderingLoop(): void {
        this._webGlRenderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        );

        this._lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
     }

    // for child classes to use: this function is called at each frame
    protected update(timesinceLastFrame: number): void {}
    // for child classes to use : this function is called before the rendering loop but after the scene creation
    protected onInit(): void {}
    protected get renderer(): WebGLRenderer {
        return this._webGlRenderer;
     }

    protected get scene(): Scene {
        return this._scene;
     }

    protected get container(): HTMLDivElement {
        return this._container;
     }

    protected getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
     }

    private initStats(): void {
        if (this.statsEnabled) {
            this._stats = new Stats();
            this._stats.dom.style.position = "absolute";
            this.container.appendChild(this._stats.dom);
        }
     }

    private createScene(): void {
        this._scene = new Scene();

        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this._cameraManager.onResize(this.getAspectRatio());
     }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.rendererUpdate();
        this.renderer.render(this.scene, this._cameraManager.camera);
        if (this.statsEnabled) {
            this._stats.update();
        }
     }

    private rendererUpdate(): void {
        const timeSinceLastFrame: number = Date.now() - this._lastDate;
        this.update(timeSinceLastFrame);
        this._cameraManager.updatecarInfos(
            this.cameraTargetPosition,
            this.cameraTargetDirection
        );
        this._cameraManager.update(timeSinceLastFrame);
        this._lastDate = Date.now();
     }

    public getRelativePosition(pos: Vector2): Vector3 {
        const distanceToCenter: Vector3 = this.getDistanceCenterScreen(pos);
        distanceToCenter.setX(distanceToCenter.x + this.cameraTargetPosition.x);
        distanceToCenter.setZ(distanceToCenter.z + this.cameraTargetPosition.z);

        return distanceToCenter;
     }

    public getDistanceCenterScreen(pos: Vector2): Vector3 {
        const htmlElem: HTMLCanvasElement = this.renderer.domElement;
        const cameraClientRatio: Vector2 = new Vector2(
            DOUBLE * this._cameraManager.cameraDistanceToCar * this.getAspectRatio() / htmlElem.clientWidth,
            DOUBLE * this._cameraManager.cameraDistanceToCar / htmlElem.clientHeight
        );

        const clientClickPos: Vector2 = new Vector2(
            pos.x - HALF * htmlElem.clientWidth,
            pos.y - HALF * htmlElem.clientHeight
        );

        return new Vector3(
            clientClickPos.x * cameraClientRatio.x,
            C.LINE_Y_POSITION,
            clientClickPos.y * cameraClientRatio.y
        );
     }

    public getClientPosition(pos: Vector3): Vector2 {
        const htmlElem: HTMLCanvasElement = this.renderer.domElement;

        const cameraClientRatio: Vector2 = new Vector2(
            DOUBLE * this._cameraManager.cameraDistanceToCar * this.getAspectRatio() / htmlElem.clientWidth,
            DOUBLE * this._cameraManager.cameraDistanceToCar / htmlElem.clientHeight
        );

        const clientClickPos: Vector2 = new Vector2(
            (pos.x - this.cameraTargetPosition.x ) /  cameraClientRatio.x,
            (pos.z - this.cameraTargetPosition.z ) / cameraClientRatio.y
        );

        return new Vector2(
            clientClickPos.x + HALF * htmlElem.clientWidth,
            clientClickPos.y + HALF * htmlElem.clientHeight
        );
     }
}
