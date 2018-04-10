import { Injectable } from "@angular/core";
import {
    Mesh,
    Texture,
    RepeatWrapping,
    PlaneGeometry,
    DoubleSide,
    MeshPhongMaterial,
    Vector3
} from "three";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { SoundManagerService } from "../sound-manager-service/sound-manager.service";
import { Renderer } from "../../renderer/renderer";
import { InputManagerService } from "../../input-manager-service/input-manager.service";
import { CollisionDetectorService } from "../collision/collision-detector.service";
import {
    CameraType,
    PI_OVER_2,
    CHANGE_CAMERA_KEYCODE,
    TOGGLE_CAMERA_EFFECT_MODE,
    ZOOM_IN_KEYCODE,
    ZOOM_OUT_KEYCODE,
    TOGGLE_NIGHT_MODE_KEYCODE,
    TOGGLE_SUNLIGHT_KEYCODE,
} from "../../../global-constants/constants";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { LightManagerService } from "../light-manager/light-manager.service";
import { GameConfiguration } from "../game-configuration/game-configuration";
import { TrackLoaderService } from "../../track-loader/track-loader.service";
import { Vector3Struct } from "../../../../../../common/race/vector3-struct";
import { UserPlayer } from "../player/user-player";
import { AiPlayer } from "../player/ai-player";
import { SpawnPoint, SpawnPointFinder } from "./spawn-point";
import { LoaderService } from "../loader-service/loader.service";
import { LoadedObject, LoadedTexture } from "../loader-service/load-types.enum";

const OFF_ROAD_Z_TRANSLATION: number = 0.1;
const FLOOR_DIMENSION: number = 10000;
const FLOOR_TEXTURE_RATIO: number = 0.1;
const N_AI_CONTROLLED_CARS: number = 5;
const NO_TRACK_POINTS: Array<Vector3Struct> = [new Vector3Struct(0, 0, 0), new Vector3Struct(0, 0, 1), new Vector3Struct(0, 0, 0)];

export class CarInfos {
    public constructor(
        public speed: number,
        public gear: number,
        public rpm: number
    ) { }
}

const COLORS: LoadedObject[] =  [
LoadedObject.carYellow,
LoadedObject.carGreen,
LoadedObject.carRed,
LoadedObject.carOrange,
LoadedObject.carPurple,
LoadedObject.carPink
];

@Injectable()
export class GameManagerService extends Renderer {
    private _player: UserPlayer;
    private _aiControlledCars: Array<AiPlayer>;
    private _hudTimerSubject: Subject<number>;
    private _hudLapResetSubject: Subject<void>;
    private _gameConfiguration: GameConfiguration;

    public constructor(cameraManager: CameraManagerService,
                       private inputManager: InputManagerService,
                       private soundManager: SoundManagerService,
                       private collisionDetector: CollisionDetectorService,
                       private lightManager: LightManagerService,
                       private loader: LoaderService) {
        super(cameraManager, false);
        this._gameConfiguration = new GameConfiguration();
        this._hudTimerSubject = new Subject<number>();
        this._hudLapResetSubject = new Subject<void>();
        this._player = new UserPlayer(this.inputManager);
        this._aiControlledCars = new Array<AiPlayer>();
    }

    public get playerInfos(): CarInfos {
        return new CarInfos(this._player.car.speed,
                            this._player.car.currentGear,
                            this._player.car.rpm);
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

    public start(container: HTMLDivElement, config: GameConfiguration): void {
        this._gameConfiguration = config;
        this.init(container);
        this.initKeyBindings();
        this.initSoundManager();
        this.initCameraManager();
        this.initTrack();
        this.initCars();
        this.initScene();
        this.startRenderingLoop();
    }

    protected update(deltaTime: number): void {
        this.collisionDetector.detectCollisions(this.scene);
        this._player.update(deltaTime);
        this._hudTimerSubject.next(deltaTime);
        this._aiControlledCars.forEach((aiCar) => aiCar.update(deltaTime));
        this.cameraTargetDirection = this._player.car.direction;
        this.cameraTargetPosition = this._player.car.getPosition();
        this.lightManager.updateSunlight();
    }

    public initTrack(): void {
        if (this._gameConfiguration.trackMeshs != null && this._gameConfiguration.trackWalls != null) {
            this._gameConfiguration.trackMeshs.forEach((m) => this.scene.add(m));
            this._gameConfiguration.trackWalls.forEach((w) => this.scene.add(w));
        }
    }

    private initCars(): void {
        const points: Array<Vector3Struct> = this._gameConfiguration.track != null ? this._gameConfiguration.track.points : NO_TRACK_POINTS;
        const track: Array<Vector3> = TrackLoaderService.toVectors(points);
        const spawnPoints: Array<SpawnPoint> = SpawnPointFinder.findSpawnPoints(track, N_AI_CONTROLLED_CARS + 1);
        this._player.init(spawnPoints[0].position, this.loader, COLORS[0], this.cameraManager.audioListener);
        this._player.car.mesh.lookAt(spawnPoints[0].direction);

        for (let i: number = 0; i < N_AI_CONTROLLED_CARS; i++) {
            this._aiControlledCars.push(new AiPlayer(this.cameraManager, track));
            this._aiControlledCars[i].init(spawnPoints[i + 1].position, this.loader, COLORS[(i + 1) % COLORS.length],
                                           this.cameraManager.audioListener);
            this._aiControlledCars[i].car.mesh.lookAt(spawnPoints[i + 1].direction);
        }
    }

    private initKeyBindings(): void {
        this.inputManager.registerKeyDown(CHANGE_CAMERA_KEYCODE, () => this.cameraManager.switchCamera());
        this.inputManager.registerKeyDown(TOGGLE_CAMERA_EFFECT_MODE, () => this.cameraManager.toggleCameraEffect());
        this.inputManager.registerKeyDown(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomIn());
        this.inputManager.registerKeyDown(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomOut());
        this.inputManager.registerKeyDown(TOGGLE_NIGHT_MODE_KEYCODE, () => this.lightManager.toggleNightMode());
        this.inputManager.registerKeyUp(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomRelease());
        this.inputManager.registerKeyUp(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomRelease());
        this.inputManager.registerKeyUp(TOGGLE_SUNLIGHT_KEYCODE, () => this.lightManager.toggleSunlight());
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
        this.scene.add(this._player.car);
        this._aiControlledCars.forEach((aiCar) => this.scene.add(aiCar.car));
        this.lightManager.init(this.scene, this._player.car, this._aiControlledCars.map((aiCar) => aiCar.car));
    }

    private getFloor(): Mesh {
        const texture: Texture = this.loader.getTexture(LoadedTexture.offRoad);
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
