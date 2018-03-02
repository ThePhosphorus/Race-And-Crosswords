import { Injectable } from "@angular/core";
import {
    CubeTextureLoader,
    Mesh, Texture, TextureLoader, RepeatWrapping, PlaneGeometry, DoubleSide, DirectionalLight, MeshPhongMaterial, Vector3, SpotLight
} from "three";
import { Car } from "../car/car";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { SoundManagerService } from "../sound-manager-service/sound-manager.service";
import { Renderer } from "../renderer/renderer";
import { InputManagerService } from "../input-manager-service/input-manager.service";

const FLOOR_DIMENSION: number = 1000;
const SPAWN_DIMENSION: number = 100;
const FLOOR_TEXTURE_RATIO: number = 0.05;
const OFF_ROAD_Z_TRANSLATION: number = 0.01;
const OFF_ROAD_PATH: string = "../../assets/textures/grass.jpg";
const TRACK_PATH: string = "../../assets/textures/floor.jpg";
const HALF: number = 0.5;
const PI_OVER_2: number = Math.PI * HALF;
const BACKGROUND_PATH: string = "../../assets/skybox/sky1/";
const D_LIGHT: number = 200;
const S_LIGHT: number = D_LIGHT * 0.25;

// Keycodes
const ACCELERATE_KEYCODE: number = 87; // w
const LEFT_KEYCODE: number = 65; // a
const BRAKE_KEYCODE: number = 83; // s
const RIGHT_KEYCODE: number = 68; // d
const CHANGE_CAMERA_KEYCODE: number = 67; // c
const TOOGLE_CAMERA_EFFECT_MODE: number = 88; // ,
const ZOOM_IN_KEYCODE: number = 187; // +
const ZOOM_OUT_KEYCODE: number = 189; // -
const FULLSCREEN_KEYCODE: number = 70; // F

@Injectable()
export class RenderService extends Renderer {
    private _car: Car;
    private _carInfos: CarInfos;
    private sunlight: DirectionalLight;
    private carlight: SpotLight;
    private brakeLight: SpotLight;
    private brakeReflectionRight: SpotLight;
    private brakeReflectionLeft: SpotLight;
    private brakeReflectionRightExt: SpotLight;
    private brakeReflectionLeftExt: SpotLight;

    public constructor(private cameraManager: CameraManagerService,
                       private inputManager: InputManagerService,
                       private soundManager: SoundManagerService) {
        super(cameraManager, false);
        this._car = new Car();
        this._carInfos = new CarInfos(0, 0, 0);
        this.setupKeyBindings();
    }

    public get carInfos(): CarInfos {
        return this._carInfos;
    }

    private setupKeyBindings(): void {
        this.inputManager.resetBindings();
        this.inputManager.registerKeyDown(ACCELERATE_KEYCODE, () => this._car.accelerate());
        this.inputManager.registerKeyDown(BRAKE_KEYCODE, () => this._car.brake());
        this.inputManager.registerKeyDown(BRAKE_KEYCODE, () => this.activateBrakeLights());
        this.inputManager.registerKeyDown(LEFT_KEYCODE, () => this._car.steerLeft());
        this.inputManager.registerKeyDown(RIGHT_KEYCODE, () => this._car.steerRight());
        this.inputManager.registerKeyDown(CHANGE_CAMERA_KEYCODE, () => this.cameraManager.switchCamera());
        this.inputManager.registerKeyDown(TOOGLE_CAMERA_EFFECT_MODE, () => this.cameraManager.toggleEffect());
        this.inputManager.registerKeyDown(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomIn());
        this.inputManager.registerKeyDown(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomOut());
        this.inputManager.registerKeyDown(FULLSCREEN_KEYCODE, () => this.fullscreen());

        this.inputManager.registerKeyUp(ACCELERATE_KEYCODE, () => this._car.releaseAccelerator());
        this.inputManager.registerKeyUp(BRAKE_KEYCODE, () => this._car.releaseBrakes());
        this.inputManager.registerKeyUp(BRAKE_KEYCODE, () => this.disableBrakeLights());
        this.inputManager.registerKeyUp(LEFT_KEYCODE, () => this._car.releaseSteeringLeft());
        this.inputManager.registerKeyUp(RIGHT_KEYCODE, () => this._car.releaseSteeringRight());
        this.inputManager.registerKeyUp(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomRelease());
        this.inputManager.registerKeyUp(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomRelease());
    }

    private fullscreen(): void {
        this.container.webkitRequestFullscreen();
        this.onResize();
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        this.init(container);
        this.soundManager.init(this.cameraManager.listener);
        this.loadSunlight();
        this.loadCarLights();
        this.loadBrakeLights();

        await this._car.init();
        this.soundManager.startRace();
        this.soundManager.addCarSound(this._car);
        this.cameraManager.updatecarInfos(
            this._car.getPosition(),
            this._car.direction
        );
        this.scene.add(this._car);
        this.scene.add(this.getFloor());
        this.scene.add(this.getTrack());
        this.startRenderingLoop();
    }
    private loadCarLights(): void {
        this.carlight = new SpotLight(0xFFE6CC, 1, 15, 1);
        this.carlight.penumbra = 0.4;
        this.scene.add(this.carlight);
    }
    private loadBrakeLights(): void {
        this.brakeLight = new SpotLight(0xFF0000, 0);
        this.brakeLight.angle = 0.6;
        this.brakeLight.penumbra = 1;
        this.brakeReflectionLeft = new SpotLight(0xFF0000, 0, 2, 0.1);
        this.brakeReflectionRight = new SpotLight(0xFF0000, 0, 2, 0.1);
        this.brakeReflectionLeftExt = new SpotLight(0xFF0000,0,2,0.1);
        this.brakeReflectionRightExt = new SpotLight(0xFF0000,0,2,0.1);
        this.scene.add(this.brakeReflectionLeft);
        this.scene.add(this.brakeReflectionRight);
        this.scene.add(this.brakeReflectionLeftExt);
        this.scene.add(this.brakeReflectionRightExt);
        this.scene.add(this.brakeLight);
    }
    private loadSunlight(): void {
        this.sunlight = new DirectionalLight(0xffe382, 0.7);
        this.sunlight.position.set(-1, 1, -1);
        this.sunlight.position.multiplyScalar(25);
        this.sunlight.castShadow = true;
        this.sunlight.shadow.camera.bottom = -S_LIGHT;
        this.sunlight.shadow.camera.top = S_LIGHT;
        this.sunlight.shadow.camera.left = -S_LIGHT;
        this.sunlight.shadow.camera.right = S_LIGHT;
        this.sunlight.shadow.camera.near = D_LIGHT / 30;
        this.sunlight.shadow.camera.far = D_LIGHT;
        this.sunlight.shadow.mapSize.x = 1024 * 2;
        this.sunlight.shadow.mapSize.y = 1024 * 2;
        this.scene.add(this.sunlight);
    }
    private getFloor(): Mesh {
        const texture: Texture = new TextureLoader().load(OFF_ROAD_PATH);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(FLOOR_DIMENSION * FLOOR_TEXTURE_RATIO, FLOOR_DIMENSION * FLOOR_TEXTURE_RATIO);
        const material: MeshPhongMaterial = new MeshPhongMaterial({ map: texture, side: DoubleSide });
        const plane: Mesh = new Mesh(new PlaneGeometry(FLOOR_DIMENSION, FLOOR_DIMENSION), material);
        plane.rotateX(PI_OVER_2);
        plane.receiveShadow = true;
        plane.translateZ(OFF_ROAD_Z_TRANSLATION);

        return plane;
    }

    private getTrack(): Mesh {
        const texture: Texture = new TextureLoader().load(TRACK_PATH);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(SPAWN_DIMENSION * FLOOR_TEXTURE_RATIO, SPAWN_DIMENSION * FLOOR_TEXTURE_RATIO);
        const material: MeshPhongMaterial = new MeshPhongMaterial({ map: texture, side: DoubleSide });
        material.reflectivity = 0.1;
        const plane: Mesh = new Mesh(new PlaneGeometry(SPAWN_DIMENSION, SPAWN_DIMENSION), material);
        plane.receiveShadow = true;
        plane.rotateX(PI_OVER_2);

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
        this.updateCarlight();
        this.updateBrakelights();
        this.updateSunlight();
        this.soundManager.updateCarRpm(this._car.id, this._car.rpm);
    }

    private updateCarInfos(): void {
        this._carInfos.speed = this._car.speed.length();
        this._carInfos.gear = this._car.currentGear;
        this._carInfos.rpm = this._car.rpm;
    }

    private updateSunlight(): void {
        const sunlightoffSet: Vector3 = new Vector3(-10, 10, -10);
        this.sunlight.target = this._car["mesh"];
        this.sunlight.position.copy((this._car.getPosition().clone().add(sunlightoffSet)));
    }

    private updateCarlight(): void {
        const carlightoffSet: Vector3 = new Vector3(0, 1, 0);
        this.carlight.position.copy((this._car.getPosition().clone().add(this._car.direction).add(carlightoffSet)));
        this.carlight.target.position.copy((this._car.getPosition().clone().add(this._car.direction.multiplyScalar(10))));
        this.carlight.target.updateMatrixWorld(true);
    }
    private activateBrakeLights(): void {
        const newIntensity: number = 2;
        this.brakeLight.intensity = newIntensity * HALF;
        this.brakeReflectionLeft.intensity = newIntensity;
        this.brakeReflectionLeftExt.intensity = newIntensity;
        this.brakeReflectionRight.intensity = newIntensity;
        this.brakeReflectionRightExt.intensity = newIntensity;
    }

    private disableBrakeLights(): void {
        const newIntensity: number = 0;
        this.brakeLight.intensity = newIntensity;
        this.brakeReflectionLeft.intensity = newIntensity;
        this.brakeReflectionLeftExt.intensity = newIntensity;
        this.brakeReflectionRight.intensity = newIntensity;
        this.brakeReflectionRightExt.intensity = newIntensity;
    }

    private updateBrakelights(): void {
        const brakeLightOffset: Vector3 = new Vector3(0, 0.75, 0);
        this.brakeLight.position.copy((this._car.getPosition().clone().sub(this._car.direction.multiplyScalar(0.7)).add(brakeLightOffset)));
        this.brakeLight.target.position.copy((this._car.getPosition().clone().sub(this._car.direction.multiplyScalar(4))));
        this.brakeLight.target.updateMatrixWorld(true);

        const brakeReflectionOffset: Vector3 = new Vector3(0, 0.63, 0);

        const upVector: Vector3 = new Vector3(0, 1, 0);
        const downVector: Vector3 = new Vector3(0, -1, 0);
        this.brakeReflectionLeft.position.copy((this._car.getPosition().clone().sub(this._car.direction.clone().multiplyScalar(2)).add(brakeReflectionOffset)));
        this.brakeReflectionLeft.position.add(upVector.clone().cross(this._car.direction).multiplyScalar(0.29));
        this.brakeReflectionLeft.target.position.copy((this._car.getPosition().clone().add(this._car.direction.multiplyScalar(10))));
        this.brakeReflectionLeft.target.updateMatrixWorld(true);

        this.brakeReflectionRight.position.copy((this._car.getPosition().clone().sub(this._car.direction.clone().multiplyScalar(2)).add(brakeReflectionOffset)));
        this.brakeReflectionRight.position.add(downVector.clone().cross(this._car.direction).multiplyScalar(0.29));
        this.brakeReflectionRight.target.position.copy((this._car.getPosition().clone().add(this._car.direction.multiplyScalar(10))));
        this.brakeReflectionRight.target.updateMatrixWorld(true);


        this.brakeReflectionLeftExt.position.copy((this._car.getPosition().clone().sub(this._car.direction.multiplyScalar(2)).add(brakeReflectionOffset)));
        this.brakeReflectionLeftExt.position.add(upVector.clone().cross(this._car.direction).multiplyScalar(0.47));
        this.brakeReflectionLeftExt.target.position.copy((this._car.getPosition().clone().add(this._car.direction.multiplyScalar(10))));
        this.brakeReflectionLeftExt.target.updateMatrixWorld(true);

        this.brakeReflectionRightExt.position.copy((this._car.getPosition().clone().sub(this._car.direction.multiplyScalar(2)).add(brakeReflectionOffset)));
        this.brakeReflectionRightExt.position.add(downVector.clone().cross(this._car.direction).multiplyScalar(0.47));
        this.brakeReflectionRightExt.target.position.copy((this._car.getPosition().clone().add(this._car.direction.multiplyScalar(10))));
        this.brakeReflectionRightExt.target.updateMatrixWorld(true);
    }
}
export class CarInfos {
    public constructor(
        public speed: number,
        public gear: number,
        public rpm: number
    ) { }
}

export enum CarControls {
    Accelerate,
    Brake,
    Left,
    Right
}
