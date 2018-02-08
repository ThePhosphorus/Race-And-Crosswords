import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { WebGLRenderer, Scene, AmbientLight } from "three";
import Stats = require("stats.js");

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.85;

export abstract class Renderer {
    private _container: HTMLDivElement;
    private _renderer: WebGLRenderer;
    private _scene: Scene;
    private _lastDate: number;
    private stats: Stats;
    private _cameraManager: CameraManagerService;

    public constructor( cameraManager: CameraManagerService, private statsEnabled: boolean) {
        this._cameraManager = cameraManager;
    }

    public init(container: HTMLDivElement): void {
        this._container = container;
        this.initStats();
        this.createScene();
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
        this._renderer = new WebGLRenderer();
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
        return this._renderer;
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
            this.stats = new Stats();
            this.stats.dom.style.position = "absolute";
            this.container.appendChild(this.stats.dom);
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
            this.stats.update();
        }
     }

    private rendererUpdate(): void {
        const timeSinceLastFrame: number = Date.now() - this._lastDate;
        this.update(timeSinceLastFrame);
        this._cameraManager.update(timeSinceLastFrame);
        this._lastDate = Date.now();
     }
}