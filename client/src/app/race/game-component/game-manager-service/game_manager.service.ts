import { Injectable } from "@angular/core";
import {
    CubeTextureLoader,
    Mesh,
    Texture,
    TextureLoader,
    RepeatWrapping,
    PlaneGeometry,
    DoubleSide,
    MeshPhongMaterial,
    AmbientLight,
    DirectionalLight,
    Vector3
} from "three";
import { Car } from "../car/car";
import { CameraManagerService, TargetInfos } from "../../camera-manager-service/camera-manager.service";
import { SoundManagerService } from "../sound-manager-service/sound-manager.service";
import { Renderer } from "../../renderer/renderer";
import { InputManagerService } from "../../input-manager-service/input-manager.service";
import { CollisionDetectorService } from "../collision/collision-detector.service";
import {
    CameraType,
    PI_OVER_2,
    WHITE,
    SUNSET,
    AMBIENT_LIGHT_OPACITY,
    AMBIENT_NIGHT_LIGHT_OPACITY,
    QUARTER,
    SHADOWMAP_SIZE,
    SHADOW_CAMERA_PLANE_RATIO
} from "../../../global-constants/constants";

const FLOOR_DIMENSION: number = 10000;
const FLOOR_TEXTURE_RATIO: number = 0.1;
const OFF_ROAD_Z_TRANSLATION: number = 0.1;
const OFF_ROAD_PATH: string = "../../assets/textures/grass.jpg";
const NIGHT_BACKGROUND_PATH: string = "../../assets/skybox/sky3/";
const BACKGROUND_PATH: string = "../../assets/skybox/sky1/";
const N_AI_CONTROLLED_CARS: number = 1;
const SPACE_BETWEEN_CARS: number = 4;
const D_LIGHT_PLANE_SIZE: number = 200;

const DIRECTIONAL_LIGHT_OFFSET: number = 5;
const SHADOW_BIAS: number = 0.0001;
const SUNLIGHT_INTENSITY: number = 0.2;
// Keycodes
const ACCELERATE_KEYCODE: number = 87; // w
const LEFT_KEYCODE: number = 65; // a
const BRAKE_KEYCODE: number = 83; // s
const RIGHT_KEYCODE: number = 68; // d
const CHANGE_CAMERA_KEYCODE: number = 67; // c
const TOGGLE_CAMERA_EFFECT_MODE: number = 88; // x
const ZOOM_IN_KEYCODE: number = 187; // +
const ZOOM_OUT_KEYCODE: number = 189; // -
const TOGGLE_NIGHT_MODE_KEYCODE: number = 78; // n
const TOGGLE_SUNLIGHT_KEYCODE: number = 77; // m

export class CarInfos {
    public constructor(
        public speed: number,
        public gear: number,
        public rpm: number
    ) { }
}

@Injectable()
export class GameManagerService extends Renderer {
    private player: Car;
    private aiControlledCars: Array<Car>;
    private _isShadowMode: boolean;
    private _isNightMode: boolean;
    private _directionalLight: DirectionalLight;
    private _dayAmbientLight: AmbientLight;
    private _nightAmbientLight: AmbientLight;

    public constructor(private cameraManager: CameraManagerService,
                       private inputManager: InputManagerService,
                       private soundManager: SoundManagerService,
                       private collisionDetector: CollisionDetectorService) {

        super(cameraManager, true);
        this._dayAmbientLight = new AmbientLight(SUNSET, AMBIENT_LIGHT_OPACITY);
        this._nightAmbientLight = new AmbientLight(WHITE, AMBIENT_NIGHT_LIGHT_OPACITY);
        this._isNightMode = false;
        this._isShadowMode = false;
        this.loadSunlight();

        this.player = new Car();
        this.aiControlledCars = new Array<Car>();
        for (let index: number = 0; index < N_AI_CONTROLLED_CARS; index++) {
            this.aiControlledCars.push(new Car());
        }
    }

    public get playerInfos(): CarInfos {
        return new CarInfos(this.player.speed.length(),
                            this.player.currentGear,
                            this.player.rpm);
    }

    public async start(container: HTMLDivElement): Promise<void> {
        this.init(container);
        await this.initCars();
        this.initKeyBindings();
        this.initSoundManager();
        this.initCameraManager();
        this.initSkybox();
        this.initScene();
        this.startRenderingLoop();
    }

    protected update(deltaTime: number): void {
        this.player.update(deltaTime);
        this.aiControlledCars.forEach((car) => car.update(deltaTime));
        this.cameraTargetDirection = this.player.direction;
        this.cameraTargetPosition = this.player.getPosition();
        this.soundManager.updateCarRpm(this.player.id, this.player.rpm);
        this.collisionDetector.detectCollisions(this.scene);
        this.updateSunlight();
    }

    private async initCars(): Promise<void> {
        await this.player.init(new Vector3(0, 0, 0));
        for (let i: number = 0; i < this.aiControlledCars.length; i++) {
            await this.aiControlledCars[i].init(new Vector3(0, 0, (i + 1) * SPACE_BETWEEN_CARS));
        }
    }

    public importTrack(meshs: Mesh[]): void {
        meshs.forEach((m: Mesh) => this.scene.add(m));
    }

    private initKeyBindings(): void {
        this.inputManager.registerKeyDown(ACCELERATE_KEYCODE, () => this.player.accelerate());
        this.inputManager.registerKeyDown(BRAKE_KEYCODE, () => this.player.brake());
        this.inputManager.registerKeyDown(LEFT_KEYCODE, () => this.player.steerLeft());
        this.inputManager.registerKeyDown(RIGHT_KEYCODE, () => this.player.steerRight());
        this.inputManager.registerKeyDown(CHANGE_CAMERA_KEYCODE, () => this.cameraManager.switchCamera());
        this.inputManager.registerKeyDown(TOGGLE_CAMERA_EFFECT_MODE, () => this.cameraManager.toggleCameraEffect());
        this.inputManager.registerKeyDown(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomIn());
        this.inputManager.registerKeyDown(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomOut());
        this.inputManager.registerKeyUp(ACCELERATE_KEYCODE, () => this.player.releaseAccelerator());
        this.inputManager.registerKeyUp(BRAKE_KEYCODE, () => this.player.releaseBrakes());
        this.inputManager.registerKeyUp(LEFT_KEYCODE, () => this.player.releaseSteeringLeft());
        this.inputManager.registerKeyUp(RIGHT_KEYCODE, () => this.player.releaseSteeringRight());
        this.inputManager.registerKeyDown(TOGGLE_NIGHT_MODE_KEYCODE, () => this.toggleNightMode());
        this.inputManager.registerKeyUp(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomRelease());
        this.inputManager.registerKeyUp(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomRelease());
        this.inputManager.registerKeyUp(TOGGLE_SUNLIGHT_KEYCODE, () => this.toggleSunlight());
    }

    private loadSunlight(): void {
        this._directionalLight = new DirectionalLight(SUNSET, SUNLIGHT_INTENSITY);
        this._directionalLight.castShadow = true;
        this._directionalLight.shadow.camera.bottom = -D_LIGHT_PLANE_SIZE * QUARTER;
        this._directionalLight.shadow.camera.top = D_LIGHT_PLANE_SIZE * QUARTER;
        this._directionalLight.shadow.camera.left = -D_LIGHT_PLANE_SIZE * QUARTER;
        this._directionalLight.shadow.camera.right = D_LIGHT_PLANE_SIZE * QUARTER;
        this._directionalLight.shadow.camera.near = D_LIGHT_PLANE_SIZE * SHADOW_CAMERA_PLANE_RATIO;
        this._directionalLight.shadow.camera.far = D_LIGHT_PLANE_SIZE;
        this._directionalLight.shadow.mapSize.x = SHADOWMAP_SIZE;
        this._directionalLight.shadow.mapSize.y = SHADOWMAP_SIZE;
        this._directionalLight.shadowBias = SHADOW_BIAS;
    }

    private loadSkybox(path: string): void {
        this.scene.background = new CubeTextureLoader()
        .setPath(path)
        .load([
            "posx.png",
            "negx.png",
            "posy.png",
            "negy.png",
            "posz.png",
            "negz.png"
        ]);
    }

    private toggleNightMode(): void {

        this.player.toggleNightLight();
        if (this._isNightMode) {
            this.scene.remove(this._nightAmbientLight);
            this.scene.add(this._dayAmbientLight);
            this.loadSkybox(BACKGROUND_PATH);
            this._isNightMode = false;
            if (this._isShadowMode) {
                this.scene.add(this._directionalLight);
            }
        } else {
            this.scene.remove(this._dayAmbientLight);
            this.scene.add(this._nightAmbientLight);
            this.loadSkybox(NIGHT_BACKGROUND_PATH);
            this._isNightMode = true;
            if (this._isShadowMode) {
                this.scene.remove(this._directionalLight);
            }
        }
    }

    private toggleSunlight(): void {
        if (this.scene.children.find( (x) => x.id === this._directionalLight.id) !== undefined) {
            this.scene.remove(this._directionalLight);
            this._isShadowMode = false;
        } else if (!this._isNightMode) {
            this.scene.add(this._directionalLight);
            this._isShadowMode = true;
        }
    }

    private initSkybox(): void {
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

    private initSoundManager(): void {
        this.soundManager.init(this.cameraManager.audioListener);
        this.soundManager.startRace();
        this.soundManager.addCarSound(this.player);
        this.aiControlledCars.forEach((car) => this.soundManager.addCarSound(car));
    }

    private initCameraManager(): void {
        this.cameraManager.cameraType = CameraType.Perspective;
        this.cameraManager.updateTargetInfos(new TargetInfos(
            this.player.getPosition(),
            this.player.direction
        ));
    }

    private initScene(): void {
        this.scene.add(this.getFloor());
        this.scene.add(this.player);
        this.aiControlledCars.forEach((car) => this.scene.add(car));
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
        plane.receiveShadow = true;

        return plane;
    }

    private updateSunlight(): void {
        const sunlightoffSet: Vector3 = new Vector3(-DIRECTIONAL_LIGHT_OFFSET, DIRECTIONAL_LIGHT_OFFSET, -DIRECTIONAL_LIGHT_OFFSET);
        this._directionalLight.target = this.player["mesh"];
        this._directionalLight.position.copy((this.player.getPosition().clone().add(sunlightoffSet)));
    }
}
