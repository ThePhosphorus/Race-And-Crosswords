import { Injectable } from "@angular/core";
import {
    CubeTextureLoader,
    Mesh,
    Texture,
    TextureLoader,
    RepeatWrapping,
    MeshLambertMaterial,
    PlaneGeometry,
    DoubleSide,
    Vector3
} from "three";
import { Car } from "../car/car";
import { CameraManagerService, TargetInfos } from "../../camera-manager-service/camera-manager.service";
import { SoundManagerService } from "../sound-manager-service/sound-manager.service";
import { Renderer } from "../../renderer/renderer";
import { InputManagerService } from "../../input-manager-service/input-manager.service";
import { CameraType, HALF } from "../../../global-constants/constants";
import { CollisionDetectorService } from "../collision/collision-detector.service";

const FLOOR_DIMENSION: number = 10000;
const SPAWN_DIMENSION: number = 100;
const FLOOR_TEXTURE_RATIO: number = 0.1;
const OFF_ROAD_Z_TRANSLATION: number = 0.1;
const OFF_ROAD_PATH: string = "../../assets/textures/grass.jpg";
const TRACK_PATH: string = "../../assets/textures/floor.jpg";
const PI_OVER_2: number = Math.PI * HALF;
const BACKGROUND_PATH: string = "../../assets/skybox/sky1/";
const N_AI_CONTROLLED_CARS: number = 1;
const SPACE_BETWEEN_CARS: number = 4;

// Keycodes
const ACCELERATE_KEYCODE: number = 87; // w
const LEFT_KEYCODE: number = 65; // a
const BRAKE_KEYCODE: number = 83; // s
const RIGHT_KEYCODE: number = 68; // d
const CHANGE_CAMERA_KEYCODE: number = 67; // c
const TOGGLE_CAMERA_EFFECT_MODE: number = 88; // x
const ZOOM_IN_KEYCODE: number = 187; // +
const ZOOM_OUT_KEYCODE: number = 189; // -

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
                       private collisionDetector: CollisionDetectorService) {
        super(cameraManager, false);
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
        this.collisionDetector.detectCollisions(this.scene);
    }

    protected update(deltaTime: number): void {
        this.player.update(deltaTime);
        this.aiControlledCars.forEach((car) => car.update(deltaTime));
        this.cameraTargetDirection = this.player.direction;
        this.cameraTargetPosition = this.player.getPosition();
        this.soundManager.updateCarRpm(this.player.id, this.player.rpm);
    }

    private async initCars(): Promise<void> {
        await this.player.init(new Vector3(0, 0, 0));
        for (let i: number = 0; i < this.aiControlledCars.length; i++) {
            await this.aiControlledCars[i].init(new Vector3(0, 0, (i + 1) * SPACE_BETWEEN_CARS));
        }
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
        this.inputManager.registerKeyUp(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomRelease());
        this.inputManager.registerKeyUp(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomRelease());
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
        this.scene.add(this.getTrack());
        this.scene.add(this.player);
        this.aiControlledCars.forEach((car) => this.scene.add(car));
    }

    private getFloor(): Mesh {
        const plane: Mesh = this.setTexture(FLOOR_DIMENSION, OFF_ROAD_PATH);
        plane.translateZ(OFF_ROAD_Z_TRANSLATION);

        return plane;
    }

    private getTrack(): Mesh {
        return this.setTexture(SPAWN_DIMENSION, TRACK_PATH);
    }

    private setTexture(dimension: number, path: string): Mesh {
        const texture: Texture = new TextureLoader().load(path);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(dimension * FLOOR_TEXTURE_RATIO, dimension * FLOOR_TEXTURE_RATIO);
        const material: MeshLambertMaterial = new MeshLambertMaterial({ map: texture, side: DoubleSide });
        const plane: Mesh = new Mesh(new PlaneGeometry(dimension, dimension), material);
        plane.rotateX(PI_OVER_2);

        return plane;
    }
}
