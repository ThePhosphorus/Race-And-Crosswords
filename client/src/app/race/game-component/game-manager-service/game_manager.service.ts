import { Injectable } from "@angular/core";
import {
    CubeTextureLoader,
    Mesh,
    Texture,
    TextureLoader,
    RepeatWrapping,
    MeshPhongMaterial,
    PlaneGeometry,
    DoubleSide,
} from "three";
import { Car } from "../car/car";
import { CameraManagerService, TargetInfos } from "../../camera-manager-service/camera-manager.service";
import { SoundManagerService } from "../sound-manager-service/sound-manager.service";
import { Renderer } from "../../renderer/renderer";
import { InputManagerService } from "../../input-manager-service/input-manager.service";
import { CameraType, PI_OVER_2 } from "../../../global-constants/constants";

const FLOOR_DIMENSION: number = 10000;
const FLOOR_TEXTURE_RATIO: number = 0.1;
const OFF_ROAD_Z_TRANSLATION: number = 0.1;
const OFF_ROAD_PATH: string = "../../assets/textures/grass.jpg";
const BACKGROUND_PATH: string = "../../assets/skybox/sky1/";

// Keycodes
const ACCELERATE_KEYCODE: number = 87; // w
const LEFT_KEYCODE: number = 65; // a
const BRAKE_KEYCODE: number = 83; // s
const RIGHT_KEYCODE: number = 68; // d
const CHANGE_CAMERA_KEYCODE: number = 67; // c
const ZOOM_IN_KEYCODE: number = 187; // +
const ZOOM_OUT_KEYCODE: number = 189; // -
const FULLSCREEN_KEYCODE: number = 70; // F
const TOGGLE_NIGHT_MODE_KEYCODE: number = 78; // n

@Injectable()
export class GameManagerService extends Renderer {
    private _car: Car;
    private _carInfos: CarInfos;

    public constructor(private cameraManager: CameraManagerService,
                       private inputManager: InputManagerService,
                       private soundManager: SoundManagerService) {
        super(cameraManager, false);
        this._car = new Car();
        this._carInfos = new CarInfos(0, 0, 0);
        this.setupKeyBindings();
    }

    public importTrack(meshs: Mesh[]): void {
        meshs.forEach((m: Mesh) => this.scene.add(m));
    }

    public get carInfos(): CarInfos {
        return this._carInfos;
    }

    private setupKeyBindings(): void {
        this.inputManager.registerKeyDown(ACCELERATE_KEYCODE, () => this._car.accelerate());
        this.inputManager.registerKeyDown(BRAKE_KEYCODE, () => this._car.brake());
        this.inputManager.registerKeyDown(LEFT_KEYCODE, () => this._car.steerLeft());
        this.inputManager.registerKeyDown(RIGHT_KEYCODE, () => this._car.steerRight());
        this.inputManager.registerKeyDown(CHANGE_CAMERA_KEYCODE, () => this.cameraManager.switchCamera());
        this.inputManager.registerKeyDown(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomIn());
        this.inputManager.registerKeyDown(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomOut());
        this.inputManager.registerKeyDown(FULLSCREEN_KEYCODE, () => this.fullscreen());
        this.inputManager.registerKeyDown(TOGGLE_NIGHT_MODE_KEYCODE, () => this.toggleNightMode());
        this.inputManager.registerKeyUp(ACCELERATE_KEYCODE, () => this._car.releaseAccelerator());
        this.inputManager.registerKeyUp(BRAKE_KEYCODE, () => this._car.releaseBrakes());
        this.inputManager.registerKeyUp(LEFT_KEYCODE, () => this._car.releaseSteeringLeft());
        this.inputManager.registerKeyUp(RIGHT_KEYCODE, () => this._car.releaseSteeringRight());
        this.inputManager.registerKeyUp(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomRelease());
        this.inputManager.registerKeyUp(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomRelease());
    }
    private toggleNightMode(): void {
        this._car.toggleNightLight();
        // TODO: change skybox and ambient light
    }

    private fullscreen(): void {
        this.container.webkitRequestFullscreen();
        this.onResize();
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        this.init(container);
        await this._car.init();
        this.initSoundManager();
        this.initCameraManager();
        this.initScene();
        this.startRenderingLoop();
    }
    private initSoundManager(): void {
        this.soundManager.init(this.cameraManager.audioListener);
        this.soundManager.startRace();
        this.soundManager.addCarSound(this._car);

    }
    private initCameraManager(): void {
        this.cameraManager.cameraType = CameraType.Perspective;
        this.cameraManager.updateTargetInfos(new TargetInfos(
            this._car.getPosition(),
            this._car.direction
        ));

    }
    private initScene(): void {
        this.scene.add(this._car);
        this.scene.add(this.getFloor());
    }

    private getFloor(): Mesh {
        const texture: Texture = new TextureLoader().load(OFF_ROAD_PATH);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(FLOOR_DIMENSION * FLOOR_TEXTURE_RATIO, FLOOR_DIMENSION * FLOOR_TEXTURE_RATIO);
        const material: MeshPhongMaterial = new MeshPhongMaterial({ map: texture, side: DoubleSide });
        const plane: Mesh = new Mesh(new PlaneGeometry(FLOOR_DIMENSION, FLOOR_DIMENSION), material);
        plane.rotateX(PI_OVER_2);
        plane.translateZ(OFF_ROAD_Z_TRANSLATION);

        return plane;
    }

    protected onInit(): void {
        this.scene.background = new CubeTextureLoader()
            .setPath(BACKGROUND_PATH)
            .load([
                "posx.png",
                "negx.png",
                "posy.png",
                "negy.png",
                "posz.png",
                "negz.png"
            ]);
    }

    protected update(timeSinceLastFrame: number): void {
        this._car.update(timeSinceLastFrame);
        this.cameraTargetDirection = this._car.direction;
        this.cameraTargetPosition = this._car.getPosition();
        this.updateCarInfos();
        this.soundManager.updateCarRpm(this._car.id, this._car.rpm);
    }

    private updateCarInfos(): void {
        this._carInfos.speed = this._car.speed.length();
        this._carInfos.gear = this._car.currentGear;
        this._carInfos.rpm = this._car.rpm;
    }
}

export class CarInfos {
    public constructor(
        public speed: number,
        public gear: number,
        public rpm: number
    ) { }
}
