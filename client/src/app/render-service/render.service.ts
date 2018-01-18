import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
    AmbientLight,
    OrthographicCamera,
    Vector3
} from "three";
import { Car } from "../car/car";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const ORTHO_CAMERA_VIEW_SIZE: number = 20;

const ACCELERATE_KEYCODE: number = 87; // w
const LEFT_KEYCODE: number = 65; // a
const BRAKE_KEYCODE: number = 83; // s
const RIGHT_KEYCODE: number = 68; // d
const CHANGE_CAMERA_KEYCODE: number = 67; // c

export const INITIAL_CAMERA_POSITION_Y: number = 25;
const WHITE: number = 0xffffff;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

export enum CameraType {
    Ortho,
    Pers
}

@Injectable()
export class RenderService {
    private perspCamera: PerspectiveCamera;
    private orthoCamera: OrthographicCamera;
    private cameraType: CameraType;
    private container: HTMLDivElement;
    private _car: Car;
    private renderer: WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;

    public get car(): Car {
        return this._car;
    }

    public constructor() {
        this._car = new Car();
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }

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
        this.lastDate = Date.now();

        this.orthoCamera.position.set(
            this._car.position.x,
            INITIAL_CAMERA_POSITION_Y,
            this._car.position.z
        );
        this.orthoCamera.lookAt(this._car.position);
    }

    private async createScene(): Promise<void> {
        this.scene = new Scene();

        this.perspCamera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        this.orthoCamera = new OrthographicCamera(
            -ORTHO_CAMERA_VIEW_SIZE * this.getAspectRatio(),
            ORTHO_CAMERA_VIEW_SIZE * this.getAspectRatio(),
            ORTHO_CAMERA_VIEW_SIZE,
            -ORTHO_CAMERA_VIEW_SIZE,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        await this._car.init();
        this.perspCamera.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this.perspCamera.lookAt(this._car.position);
        this.orthoCamera.position.set(
            this._car.position.x,
            INITIAL_CAMERA_POSITION_Y,
            this._car.position.z
        );
        this.orthoCamera.lookAt(this._car.position);
        this.cameraType = CameraType.Pers;
        this.scene.add(this._car);
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
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
        switch (this.cameraType) {
            case CameraType.Ortho:
                this.renderer.render(this.scene, this.orthoCamera);
                break;
            case CameraType.Pers:
                this.renderer.render(this.scene, this.perspCamera);
                break;
            default:
                break;
        }
        this.stats.update();
    }

    public onResize(): void {
        this.perspCamera.aspect = this.getAspectRatio();
        this.perspCamera.updateProjectionMatrix();
        this.resizeOrtho();
        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        );
    }

    private resizeOrtho(): void {
        this.orthoCamera.left = -ORTHO_CAMERA_VIEW_SIZE * this.getAspectRatio();
        this.orthoCamera.right = ORTHO_CAMERA_VIEW_SIZE * this.getAspectRatio();
        this.orthoCamera.top = ORTHO_CAMERA_VIEW_SIZE;
        this.orthoCamera.bottom = -ORTHO_CAMERA_VIEW_SIZE;
        this.orthoCamera.updateProjectionMatrix();
    }

    public switchCamera(): void {
        if (this.cameraType === CameraType.Ortho) {
            this.cameraType = CameraType.Pers;
        } else if (this.cameraType === CameraType.Pers) {
            this.cameraType = CameraType.Ortho;
        }
    }

    public get CameraType(): CameraType {
        return this.cameraType;
    }

    public set CameraType(type: CameraType) {
        this.cameraType = type;
    }

    public testUpdate(): void {
        this.update();
    }

    public testOrthoCameraPosition(): Vector3 {
        return this.orthoCamera.position;
    }
    // TODO: Create an event handler service.
    public handleKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._car.isAcceleratorPressed = true;
                break;
            case LEFT_KEYCODE:
                this._car.steerLeft();
                break;
            case RIGHT_KEYCODE:
                this._car.steerRight();
                break;
            case BRAKE_KEYCODE:
                this._car.brake();
                break;
            case CHANGE_CAMERA_KEYCODE:
                this.switchCamera();
                break;
            default:
                break;
        }
    }

    // TODO: Create an event handler service.
    public handleKeyUp(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._car.isAcceleratorPressed = false;
                break;
            case LEFT_KEYCODE:
            case RIGHT_KEYCODE:
                this._car.releaseSteering();
                break;
            case BRAKE_KEYCODE:
                this._car.releaseBrakes();
                break;
            default:
                break;
        }
    }
}
