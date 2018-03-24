import { Injectable } from "@angular/core";
import {
    Mesh,
    Texture,
    TextureLoader,
    RepeatWrapping,
    PlaneGeometry,
    DoubleSide,
    MeshPhongMaterial,
    Vector3,
    Object3D
} from "three";
import { Car } from "../car/car";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { SoundManagerService } from "../sound-manager-service/sound-manager.service";
import { Renderer } from "../../renderer/renderer";
import { InputManagerService } from "../../input-manager-service/input-manager.service";
import { CollisionDetectorService } from "../collision/collision-detector.service";
import {
    CameraType,
    PI_OVER_2,
    ACCELERATE_KEYCODE,
    BRAKE_KEYCODE,
    LEFT_KEYCODE,
    RIGHT_KEYCODE,
    CHANGE_CAMERA_KEYCODE,
    TOGGLE_CAMERA_EFFECT_MODE,
    ZOOM_IN_KEYCODE,
    ZOOM_OUT_KEYCODE,
    TOGGLE_NIGHT_MODE_KEYCODE,
    HANDBRAKE_KEYCODE,
    TOGGLE_SUNLIGHT_KEYCODE,
} from "../../../global-constants/constants";
import { LightManagerService } from "../light-manager/light-manager.service";

const FLOOR_DIMENSION: number = 10000;
const FLOOR_TEXTURE_RATIO: number = 0.1;
const OFF_ROAD_Z_TRANSLATION: number = 0.1;
const OFF_ROAD_PATH: string = "../../assets/textures/dirt.jpg";
const N_AI_CONTROLLED_CARS: number = 1;
const SPACE_BETWEEN_CARS: number = 15;

const COLORS: Array<string> = ["yellow" , "blue", "green", "orange", "pink", "purple", "red"];

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

    public constructor(private cameraManager: CameraManagerService,
                       private inputManager: InputManagerService,
                       private soundManager: SoundManagerService,
                       private collisionDetector: CollisionDetectorService,
                       private lightManager: LightManagerService ) {

        super(cameraManager, true);
        this.player = new Car(this.cameraManager);
        this.aiControlledCars = new Array<Car>();
        for (let index: number = 0; index < N_AI_CONTROLLED_CARS; index++) {
            this.aiControlledCars.push(new Car(this.cameraManager));
        }
    }

    public get playerInfos(): CarInfos {
        return new CarInfos(this.player.speed,
                            this.player.currentGear,
                            this.player.rpm);
    }

    public async start(container: HTMLDivElement): Promise<void> {
        this.init(container);
        this.initKeyBindings();
        this.initSoundManager();
        this.initCameraManager();
        await this.initCars();
        this.initScene();
        this.startRenderingLoop();
    }

    protected update(deltaTime: number): void {
        this.player.update(deltaTime);
        this.aiControlledCars.forEach((car) => car.update(deltaTime));
        this.cameraTargetDirection = this.player.direction;
        this.cameraTargetPosition = this.player.getPosition();
        this.collisionDetector.detectCollisions(this.scene);
        this.lightManager.updateSunlight();
    }

    private async initCars(): Promise<void> {
        await this.player.init(new Vector3(0, 0, 0), COLORS[0]);
        for (let i: number = 0; i < this.aiControlledCars.length; i++) {
            await this.aiControlledCars[i].init(new Vector3(-(i + 1) * SPACE_BETWEEN_CARS, 0, 0), "pink");
        }
    }

    public importTrack(meshs: Mesh[], walls: Object3D[]): void {
        meshs.forEach((m) => this.scene.add(m));
        walls.forEach((w) => this.scene.add(w));
    }

    private initKeyBindings(): void {
        this.inputManager.registerKeyDown(ACCELERATE_KEYCODE, () => this.player.carControl.accelerate());
        this.inputManager.registerKeyDown(BRAKE_KEYCODE, () => this.player.carControl.brake());
        this.inputManager.registerKeyDown(LEFT_KEYCODE, () => this.player.carControl.steerLeft());
        this.inputManager.registerKeyDown(RIGHT_KEYCODE, () => this.player.carControl.steerRight());
        this.inputManager.registerKeyDown(CHANGE_CAMERA_KEYCODE, () => this.cameraManager.switchCamera());
        this.inputManager.registerKeyDown(TOGGLE_CAMERA_EFFECT_MODE, () => this.cameraManager.toggleCameraEffect());
        this.inputManager.registerKeyDown(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomIn());
        this.inputManager.registerKeyDown(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomOut());
        this.inputManager.registerKeyDown(TOGGLE_NIGHT_MODE_KEYCODE, () => this.lightManager.toggleNightMode());
        this.inputManager.registerKeyDown(HANDBRAKE_KEYCODE, () => this.player.carControl.handBrake());
        this.inputManager.registerKeyUp(ACCELERATE_KEYCODE, () => this.player.carControl.releaseAccelerator());
        this.inputManager.registerKeyUp(BRAKE_KEYCODE, () => this.player.carControl.releaseBrakes());
        this.inputManager.registerKeyUp(LEFT_KEYCODE, () => this.player.carControl.releaseSteeringLeft());
        this.inputManager.registerKeyUp(RIGHT_KEYCODE, () => this.player.carControl.releaseSteeringRight());
        this.inputManager.registerKeyUp(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomRelease());
        this.inputManager.registerKeyUp(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomRelease());
        this.inputManager.registerKeyUp(TOGGLE_SUNLIGHT_KEYCODE, () => this.lightManager.toggleSunlight());
        this.inputManager.registerKeyUp(HANDBRAKE_KEYCODE, () => this.player.carControl.releaseHandBrake());
    }

    private initSoundManager(): void {
        this.soundManager.init(this.cameraManager.audioListener);
        this.soundManager.startRace();
    }

    private initCameraManager(): void {
        this.cameraManager.cameraType = CameraType.Perspective;
    }

    private initScene(): void {
        this.scene.add(this.getFloor());
        this.scene.add(this.player);
        this.aiControlledCars.forEach((car) => this.scene.add(car));
        this.lightManager.init(this.scene, this.player, this.aiControlledCars);
    }

    private getFloor(): Mesh {
        const texture: Texture = new TextureLoader().load(OFF_ROAD_PATH);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(FLOOR_DIMENSION * FLOOR_TEXTURE_RATIO, FLOOR_DIMENSION * FLOOR_TEXTURE_RATIO);
        const material: MeshPhongMaterial = new MeshPhongMaterial({ map: texture, side: DoubleSide });
        material.reflectivity = 0;
        material.shininess = 0;
        const plane: Mesh = new Mesh(new PlaneGeometry(FLOOR_DIMENSION, FLOOR_DIMENSION), material);
        plane.rotateX(PI_OVER_2);
        plane.translateZ(OFF_ROAD_Z_TRANSLATION);
        plane.receiveShadow = true;

        return plane;
    }

}
