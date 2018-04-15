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
    NB_LAPS,
} from "../../../global-constants/constants";
import { LightManagerService } from "../light-manager/light-manager.service";
import { GameConfiguration } from "../game-configuration/game-configuration";
import { TrackLoaderService } from "../../track-loader/track-loader.service";
import { Vector3Struct } from "../../../../../../common/race/vector3-struct";
import { UserPlayer } from "../player/user-player";
import { AiPlayer } from "../player/ai-player";
import { SpawnPoint, SpawnPointFinder } from "./spawn-point/spawn-point";
import { LoaderService } from "../loader-service/loader.service";
import { LoadedObject, LoadedTexture } from "../loader-service/load-types.enum";
import { TrackPosition } from "../player/track-position/track-position";
import { EndGameService } from "../end-game-service/end-game.service";

const OFF_ROAD_Z_TRANSLATION: number = 0.1;
const FLOOR_DIMENSION: number = 10000;
const FLOOR_TEXTURE_RATIO: number = 0.1;
const N_AI_CONTROLLED_CARS: number = 3;
const NO_TRACK_POINTS: Array<Vector3Struct> = [new Vector3Struct(0, 0, 0), new Vector3Struct(0, 0, 1), new Vector3Struct(0, 0, 0)];
const COLORS: LoadedObject[] = [
    LoadedObject.carYellow,
    LoadedObject.carGreen,
    LoadedObject.carRed,
    LoadedObject.carOrange,
    LoadedObject.carPurple,
    LoadedObject.carPink
];

export class CarInfos {
    public constructor(
        public speed: number,
        public gear: number,
        public rpm: number,
        public positionInRace: number,
        public lap: number
    ) { }
}

@Injectable()
export class GameManagerService extends Renderer {
    private _player: UserPlayer;
    private _aiControlledCars: Array<AiPlayer>;
    private _gameConfiguration: GameConfiguration;
    private _updateSubscribers: Array<(deltaTime: number) => void>;
    private _isStarted: boolean;

    public constructor(cameraManager: CameraManagerService,
                       private _inputManager: InputManagerService,
                       private _soundManager: SoundManagerService,
                       private _collisionDetector: CollisionDetectorService,
                       private _lightManager: LightManagerService,
                       private _loader: LoaderService,
                       private _endGame: EndGameService) {
        super(cameraManager, false);
        this._updateSubscribers = new Array<(deltaTime: number) => void>();
        this._gameConfiguration = new GameConfiguration();
        this._player = new UserPlayer(this._inputManager);
        this._aiControlledCars = new Array<AiPlayer>();
        this._isStarted = false;
    }

    public get playerInfos(): CarInfos {
        return new CarInfos(this._player.car.speed,
                            this._player.car.currentGear,
                            this._player.car.rpm,
                            this.getPlayerPlace(),
                            this._player.lap);
    }

    public get soundManager(): SoundManagerService {
        return this._soundManager;
    }

    public get isStarted(): boolean {
        return this._isStarted;
    }

    public subscribeToUpdate(callback: (deltaTime: number) => void): void {
        this._updateSubscribers.push(callback);
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

    public startGame(): void {
        this._isStarted = true;
    }

    private stopGame(): void {
        this._isStarted = false;
        this._aiControlledCars.forEach((ai: AiPlayer) => ai.finishRace());
        this._endGame.handleEndGame(this._player, this._aiControlledCars);
    }

    protected update(deltaTime: number): void {
        this._updateSubscribers.forEach((callback: (deltaTime: number) => void) => callback(deltaTime));

        if (this._isStarted) {
            this._collisionDetector.detectCollisions(this.scene);
            this._player.update(deltaTime);
            this._aiControlledCars.forEach((aiCar) => aiCar.update(deltaTime));

            if (this._player.lap > NB_LAPS) {
                this.stopGame();
            }
        }

        this.cameraTargetDirection = this._player.car.direction;
        this.cameraTargetPosition = this._player.car.getPosition();
        this._lightManager.updateSunlight();
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
        const trackPosition: TrackPosition = this._gameConfiguration.track != null ? new TrackPosition(track) : null;
        const randomColors: Array<LoadedObject> = COLORS.sort(() => Math.random() - 1 / 2);

        this._player.init(spawnPoints[0].position, this._loader, randomColors[0], this.cameraManager.audioListener, trackPosition);
        this._player.car.mesh.lookAt(spawnPoints[0].direction);

        for (let i: number = 0; i < N_AI_CONTROLLED_CARS; i++) {
            this._aiControlledCars.push(new AiPlayer(this.cameraManager));
            this._aiControlledCars[i].init(spawnPoints[i + 1].position, this._loader, randomColors[(i + 1) % randomColors.length],
                                           this.cameraManager.audioListener, trackPosition);
            this._aiControlledCars[i].car.mesh.lookAt(spawnPoints[i + 1].direction);
        }
    }

    private initKeyBindings(): void {
        this._inputManager.registerKeyDown(CHANGE_CAMERA_KEYCODE, () => this.cameraManager.switchCamera());
        this._inputManager.registerKeyDown(TOGGLE_CAMERA_EFFECT_MODE, () => this.cameraManager.toggleCameraEffect());
        this._inputManager.registerKeyDown(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomIn());
        this._inputManager.registerKeyDown(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomOut());
        this._inputManager.registerKeyDown(TOGGLE_NIGHT_MODE_KEYCODE, () => this._lightManager.toggleNightMode());
        this._inputManager.registerKeyUp(ZOOM_IN_KEYCODE, () => this.cameraManager.zoomRelease());
        this._inputManager.registerKeyUp(ZOOM_OUT_KEYCODE, () => this.cameraManager.zoomRelease());
        this._inputManager.registerKeyUp(TOGGLE_SUNLIGHT_KEYCODE, () => this._lightManager.toggleSunlight());
        this._inputManager.registerKeyUp(TOGGLE_SUNLIGHT_KEYCODE, () => this._lightManager.toggleNightShadows());
    }

    private initSoundManager(): void {
        this._soundManager.init(this.cameraManager.audioListener);
        this._soundManager.startRace();
    }

    private initCameraManager(): void {
        this.cameraManager.cameraType = CameraType.Perspective;
    }

    private initScene(): void {
        this.scene.add(this.getFloor());
        this.scene.add(this._player.car);
        this._aiControlledCars.forEach((aiCar) => this.scene.add(aiCar.car));
        this._lightManager.init(this.scene, this._player.car, this._aiControlledCars.map((aiCar) => aiCar.car));
    }

    private getFloor(): Mesh {
        const texture: Texture = this._loader.getTexture(LoadedTexture.offRoad);
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

    private getPlayerPlace(): number {
        const positions: Array<number> = this._aiControlledCars.map((aiPlayer) => aiPlayer.distanceOnTrack);
        const position: number = this._player.distanceOnTrack;

        let place: number = 1;
        positions.forEach((p: number) => place += p > position ? 1 : 0);

        return place;
    }
}
