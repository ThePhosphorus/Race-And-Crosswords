import { CameraManagerService, TargetInfos } from "../camera-manager-service/camera-manager.service";
import { WebGLRenderer, Scene, Vector2, Vector3, PCFShadowMap } from "three";
import Stats = require("stats.js");
import {HALF, DOUBLE} from "../../global-constants/constants";
import { CAMERA_STARTING_DIRECTION, CAMERA_STARTING_POSITION, LINE_Y_POSITION } from "../admin/track-editor.constants";

const MAX_DELTA_TIME: number = 100; // 10 FPS

export abstract class Renderer {
    private _container: HTMLDivElement;
    private _webGlRenderer: WebGLRenderer;
    private _lastDate: number;
    private _stats: Stats;
    private _cameraManager: CameraManagerService;
    protected _scene: Scene;
    protected cameraTargetPosition: Vector3;
    protected cameraTargetDirection: Vector3;

    public constructor( cameraManager: CameraManagerService, private statsEnabled: boolean) {
        this._cameraManager = cameraManager;
    }

    public init(container: HTMLDivElement): void {
        this._container = container;
        this.cameraTargetDirection = CAMERA_STARTING_DIRECTION;
        this.cameraTargetPosition = CAMERA_STARTING_POSITION;

        this.initStats();
        this.createScene();
        this._cameraManager.updateTargetInfos( new TargetInfos(
            this.cameraTargetPosition,
            this.cameraTargetDirection
        ));
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
        this._webGlRenderer.shadowMap.enabled = true;
        this._webGlRenderer.shadowMap.type = PCFShadowMap;
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
        const timeSinceLastFrame: number = Math.min(Date.now() - this._lastDate, MAX_DELTA_TIME);

        this.update(timeSinceLastFrame);
        this._cameraManager.updateTargetInfos( new TargetInfos(
            this.cameraTargetPosition.clone(),
            this.cameraTargetDirection.clone()
        ));
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
            LINE_Y_POSITION,
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

    protected get cameraManager (): CameraManagerService {
        return this._cameraManager;
    }
}
