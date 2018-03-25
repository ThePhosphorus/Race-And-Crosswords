import { Injectable } from "@angular/core";
import {
    Mesh,
    Texture,
    TextureLoader,
    RepeatWrapping,
    PlaneGeometry,
    DoubleSide,
    MeshPhongMaterial,
    Vector3
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
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { LightManagerService } from "../light-manager/light-manager.service";
import { DEFAULT_TRACK_WIDTH } from "../../race.constants";
import { GameConfiguration } from "../game-configuration/game-configuration";
import { TrackLoaderService } from "../../track-loader/track-loader.service";
import { Vector3Struct } from "../../../../../../common/race/vector3-struct";

const FLOOR_DIMENSION: number = 10000;
const FLOOR_TEXTURE_RATIO: number = 0.1;
const OFF_ROAD_Z_TRANSLATION: number = 0.1;
const OFF_ROAD_PATH: string = "../../assets/textures/orange.jpg";
const N_AI_CONTROLLED_CARS: number = 5;
const INITIAL_SPAWN_OFFSET: number = 7;
const SPACE_BETWEEN_CARS: number = 5;

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
    private _player: Car;
    private _aiControlledCars: Array<Car>;
    private _hudTimerSubject: Subject<number>;
    private _hudLapResetSubject: Subject<void>;
    private _gameConfiguration: GameConfiguration;

    public constructor(private cameraManager: CameraManagerService,
                       private inputManager: InputManagerService,
                       private soundManager: SoundManagerService,
                       private collisionDetector: CollisionDetectorService,
                       private lightManager: LightManagerService ) {
        super(cameraManager, false);
        this._gameConfiguration = new GameConfiguration();
        this._hudTimerSubject = new Subject<number>();
        this._hudLapResetSubject = new Subject<void>();
        this._player = new Car(this.cameraManager);
        this._aiControlledCars = new Array<Car>();
        for (let index: number = 0; index < N_AI_CONTROLLED_CARS; index++) {
            this._aiControlledCars.push(new Car(this.cameraManager));
        }
    }

    public get playerInfos(): CarInfos {
        return new CarInfos(this._player.speed,
                            this._player.currentGear,
                            this._player.rpm);
    }

    public get hudTimer(): Observable<number> {
        return this._hudTimerSubject.asObservable();
    }
    public get hudLapReset(): Observable<void> {
        return this._hudLapResetSubject.asObservable();
    }

    public getDeltaTime(): Observable<number> {
        return this._hudTimerSubject.asObservable();
    }

    public async start(container: HTMLDivElement, config: GameConfiguration): Promise<void> {
        this._gameConfiguration = config;
        this.init(container);
        this.initKeyBindings();
        this.initSoundManager();
        this.initCameraManager();
        this.initTrack();
        await this.initCars();
        this.initScene();
        this.startRenderingLoop();
    }

    protected update(deltaTime: number): void {
        this._player.update(deltaTime);
        this._hudTimerSubject.next(deltaTime);
        this._aiControlledCars.forEach((car) => car.update(deltaTime));
        this.cameraTargetDirection = this._player.direction;
        this.cameraTargetPosition = this._player.getPosition();
        this.collisionDetector.detectCollisions(this.scene);
        this.lightManager.updateSunlight();
    }

    public initTrack(): void {
        this._gameConfiguration.trackMeshs.forEach((m) => this.scene.add(m));
        this._gameConfiguration.trackWalls.forEach((w) => this.scene.add(w));
    }

    private async initCars(): Promise<void> {
        let offset: number = 0;
        const points: Array<Vector3Struct> = this._gameConfiguration.track.points;
        const spawnPosition: Vector3 = TrackLoaderService.toVector(points[0]);
        const spawnDirection: Vector3 = TrackLoaderService.toVector(points[points.length - 2])
            .sub(TrackLoaderService.toVector(points[points.length - 1])).normalize();
        const perpSpawnDirection: Vector3 = new Vector3(spawnDirection.z, spawnDirection.y, -spawnDirection.x);

        await this._player.init(spawnPosition.clone().add(spawnDirection.clone().multiplyScalar(INITIAL_SPAWN_OFFSET))
                                                     .add(perpSpawnDirection.clone().multiplyScalar(-DEFAULT_TRACK_WIDTH / 2 / 2)),
                                COLORS[0]);
        for (let i: number = 0; i < this._aiControlledCars.length; i++) {
            offset = i % 2 === 0 ? offset : offset + 1;
            await this._aiControlledCars[i].init(
                spawnPosition.clone().add(spawnDirection.clone().multiplyScalar((offset * SPACE_BETWEEN_CARS) + INITIAL_SPAWN_OFFSET))
                                     .add(perpSpawnDirection.clone().multiplyScalar(Math.pow(-1, i) * DEFAULT_TRACK_WIDTH / 2 / 2)),
                COLORS[(i + 1) % COLORS.length]);
        }
    }

    private initKeyBindings(): void {
        this.inputManager.registerKeyDown(ACCELERATE_KEYCODE, () => this._player.carControl.accelerate());
        this.inputManager.registerKeyDown(BRAKE_KEYCODE, () => this._player.carControl.brake());
        this.inputManager.registerKeyDown(LEFT_KEYCODE, () => this._player.carControl.steerLeft());
        this.inputManager.registerKeyDown(RIGHT_KEYCODE, () => this._player.carControl.steerRight());
        this.inputManager.registerKeyDown(CHANGE_CAMERA_KEYCODE, () => this.cameraManager.switchCamera());
        this.inputManager.registerKeyDown(TOGGLE_CAMERA_EFFECT_MODE, () => this.cameraManager.toggleCameraEffect());
        this.inputManager.registerKeyDown(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomIn());
        this.inputManager.registerKeyDown(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomOut());
        this.inputManager.registerKeyDown(TOGGLE_NIGHT_MODE_KEYCODE, () => this.lightManager.toggleNightMode());
        this.inputManager.registerKeyDown(HANDBRAKE_KEYCODE, () => this._player.carControl.handBrake());
        this.inputManager.registerKeyUp(ACCELERATE_KEYCODE, () => this._player.carControl.releaseAccelerator());
        this.inputManager.registerKeyUp(BRAKE_KEYCODE, () => this._player.carControl.releaseBrakes());
        this.inputManager.registerKeyUp(LEFT_KEYCODE, () => this._player.carControl.releaseSteeringLeft());
        this.inputManager.registerKeyUp(RIGHT_KEYCODE, () => this._player.carControl.releaseSteeringRight());
        this.inputManager.registerKeyUp(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomRelease());
        this.inputManager.registerKeyUp(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomRelease());
        this.inputManager.registerKeyUp(TOGGLE_SUNLIGHT_KEYCODE, () => this.lightManager.toggleSunlight());
        this.inputManager.registerKeyUp(HANDBRAKE_KEYCODE, () => this._player.carControl.releaseHandBrake());

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
        this.scene.add(this._player);
        this._aiControlledCars.forEach((car) => this.scene.add(car));
        this.lightManager.init(this.scene, this._player, this._aiControlledCars);
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
