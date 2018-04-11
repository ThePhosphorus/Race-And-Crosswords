import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { DefaultLoadingManager, Object3D, AudioBuffer, Texture,
    CubeTexture, ObjectLoader, AudioLoader, TextureLoader, CubeTextureLoader
} from "three";
import { LoadedObject, LoadedAudio, LoadedTexture, LoadedCubeTexture } from "./load-types.enum";

const ASSETS: string = "../../assets/";

const CAR_FOLDER: string = ASSETS + "camero/";
const YELLOW_CAR_FILE: string = CAR_FOLDER + "yellow.json";
const GREEN_CAR_FILE: string = CAR_FOLDER + "green.json";
const RED_CAR_FILE: string = CAR_FOLDER + "red.json";
const BLUE_CAR_FILE: string = CAR_FOLDER + "blue.json";
const PURPLE_CAR_FILE: string = CAR_FOLDER + "purple.json";
const PINK_CAR_FILE: string = CAR_FOLDER + "pink.json";
const ORANGE_CAR_FILE: string = CAR_FOLDER + "orange.json";

const SOUND_PATH: string = ASSETS + "sounds/";
const START_SOUND_FILE: string = SOUND_PATH + "starting.ogg";
const MUSIC_SOUND_FILE: string = SOUND_PATH + "dejavu.ogg";
const ENGINE_SOUND_FILE: string = SOUND_PATH + "engine/engine2.ogg";
const DRIFT_SOUND_FILE: string = SOUND_PATH + "drift/drift1.ogg";
const COLLISION_SOUNDS_PATH: string = SOUND_PATH + "crash/";
const CRASH_PATH_1: string = COLLISION_SOUNDS_PATH + "crash1.ogg";
const CRASH_PATH_2: string = COLLISION_SOUNDS_PATH + "crash2.ogg";
const CRASH_PATH_3: string = COLLISION_SOUNDS_PATH + "crash3.ogg";
const CRASH_PATH_4: string = COLLISION_SOUNDS_PATH + "crash4.ogg";
const CRASH_PATH_5: string = COLLISION_SOUNDS_PATH + "crash5.ogg";

const TEXTURE_PATH: string = ASSETS + "textures/";
const TRACK_TEXTURE_FILE: string = TEXTURE_PATH + "test.jpg";
const START_LINE_TEXTURE_FILE: string = TEXTURE_PATH + "linefixed.bmp";
const OFF_ROAD_TEXTURE_FILE: string = TEXTURE_PATH + "orange.jpg";

const SKYBOX_PATH: string = ASSETS + "skybox/";
const NIGHT_SKYBOX_FOLDER: string = SKYBOX_PATH + "sky3/";
const DAY_SKYBOX_FOLDER: string = SKYBOX_PATH + "sky1/";
const SKYBOX_FILES: string[] = [ "posx.png", "negx.png", "posy.png", "negy.png", "posz.png", "negz.png"];

const DEFAULT_LOADING_MESSAGE: string = "Preparing the loading";

@Injectable()
export class LoaderService {
    private _objects: Array<Object3D>;
    private _audios: Array<AudioBuffer>;
    private _textures: Array<Texture>;
    private _cubeTextures: Array<CubeTexture>;
    private _finished: BehaviorSubject<boolean>;
    private _status: BehaviorSubject<number>;
    private _loadingMsg: BehaviorSubject<string>;
    // Audio is loaded differently, therfore it does notice the ending of the loading at the right time.
    // so we use this variable to keep track of audio loading
    private _audioloaded: number ;
    private _loadingDone: boolean;
    private _nbAudio: number;

    public constructor() {
        this.init();
        this.setCallbacks();
    }

    public startLoading(): void {
        this.startLoadTexture();
        this.startLoadCar();
        this.startLoadAudio();
        this.startLoadSkybox();
    }

    public get isFinished(): Observable<boolean> {
        return this._finished.asObservable();
    }

    public get status(): Observable<number> {
        return this._status.asObservable();
    }

    public get loadingMsg(): Observable<string> {
        return this._loadingMsg.asObservable();
    }

    public getObject(type: LoadedObject): Object3D {
        if (this._objects[type]) {
            return this._objects[type].clone();
        } else {
            console.error("Object not loaded");

            return new Object3D();
        }
    }

    public getAudio(type: LoadedAudio): AudioBuffer {
        if (this._audios[type]) {
            return this._audios[type];
        } else {
            console.error("Audio not loaded");

            return null;
        }
    }
    public getTexture(type: LoadedTexture): Texture {
        if (this._textures[type]) {
            const tex: Texture = this._textures[type].clone();
            tex.needsUpdate = true;

            return tex;
        } else {
            console.error("Texture not loaded");

            return new Texture();
        }

    }
    public getCubeTexture(type: LoadedCubeTexture): CubeTexture {
        if (this._cubeTextures[type]) {
            return this._cubeTextures[type];
        } else {
            console.error("Cube Texture not loaded");

            return new CubeTexture();
        }

    }

    private init(): void {
        this._objects = new Array<Object3D>();
        this._audios = new Array<AudioBuffer>();
        this._textures = new Array<Texture>();
        this._cubeTextures = new Array<CubeTexture>();

        this._finished = new BehaviorSubject<boolean>(false);
        this._status = new BehaviorSubject<number>(0);
        this._loadingMsg = new BehaviorSubject<string>(DEFAULT_LOADING_MESSAGE);
        this._audioloaded = 0;
        this._nbAudio = 0;
        this._loadingDone = false;

        this.clearArrays();
    }

    public clearArrays(): void {
        for (const objectType of Object.keys(LoadedObject)) {
            const type: number = Number(objectType);
            if (type) {
                this._objects[type - 1] = null;
            }
        }

        for (const audioType of Object.keys(LoadedAudio)) {
            const type: number = Number(audioType);
            if (type) {
                this._audios[type - 1 ] = null;
            }
        }

        for (const textureType of Object.keys(LoadedTexture)) {
            const type: number = Number(textureType);
            if (type) {
                this._textures[type - 1] = null;
            }
        }

        for (const cubeTextureType of Object.keys(LoadedCubeTexture)) {
            const type: number = Number(cubeTextureType);
            if (type) {
                this._cubeTextures[type - 1] = null;
            }
        }
    }

    private setCallbacks(): void {
        DefaultLoadingManager.onStart = () => {
            this._loadingMsg.next("Started Loading");
        };

        DefaultLoadingManager.onProgress = (item: string, loaded: number, total: number) =>
            this.progressHandler(item, loaded, total);

        DefaultLoadingManager.onLoad = () => this.doneHandler();

        DefaultLoadingManager.onError = () => this.errorHandler();
    }

    private loadObject(path: string, type: LoadedObject): void {
        new ObjectLoader(DefaultLoadingManager).load(
            path,
            (object: Object3D) => (this._objects[type] = object)
        );
    }

    private loadAudio(path: string, type: LoadedAudio): void {
        this._nbAudio++;

        new AudioLoader(DefaultLoadingManager).load(
            path,
            (audio: AudioBuffer) => {
                this._audios[type] = audio;
                this._audioloaded++;
                this.updateDone();
            },
            () => this.progressHandler,
            () => this.errorHandler
        );
    }

    private loadTexture(path: string, type: LoadedTexture): void {
        new TextureLoader(DefaultLoadingManager).load(
            path,
            (texture: Texture) => (this._textures[type] = texture)
        );
    }

    private loadCubeTexture(path: string, files: Array<string>, type: LoadedCubeTexture): void {
        new CubeTextureLoader(DefaultLoadingManager)
            .setPath(path)
            .load(
                files,
                (cubeTexture: CubeTexture) =>
                    (this._cubeTextures[type] = cubeTexture)
            );
    }

    private errorHandler(): void {
        console.error("There was an error while loading");
    }

    private progressHandler(item: string, loaded: number, total: number): void {
        this._status.next(loaded / total);
        this._loadingMsg.next("Loading " + item + ". " + loaded + "/ " + total);
    }

    private doneHandler(): void {
        this._loadingDone = true;
        this.updateDone();
        this._loadingMsg.next("Done Loading");
    }

    private updateDone(): void {
        if (this._audioloaded / this._nbAudio === 1 && this._loadingDone) {
            this._finished.next(true);
        }
    }

    private startLoadTexture(): void {
        this.loadTexture(TRACK_TEXTURE_FILE, LoadedTexture.track);
        this.loadTexture(START_LINE_TEXTURE_FILE, LoadedTexture.start);
        this.loadTexture(OFF_ROAD_TEXTURE_FILE, LoadedTexture.offRoad);
    }

    private startLoadCar(): void {
        this.loadObject(YELLOW_CAR_FILE, LoadedObject.carYellow);
        this.loadObject(BLUE_CAR_FILE, LoadedObject.carBlue);
        this.loadObject(GREEN_CAR_FILE, LoadedObject.carGreen);
        this.loadObject(ORANGE_CAR_FILE, LoadedObject.carOrange);
        this.loadObject(PINK_CAR_FILE, LoadedObject.carPink);
        this.loadObject(PURPLE_CAR_FILE, LoadedObject.carPurple);
        this.loadObject(RED_CAR_FILE, LoadedObject.carRed);
    }

    private startLoadAudio(): void {
        this.loadAudio(START_SOUND_FILE, LoadedAudio.start);
        this.loadAudio(MUSIC_SOUND_FILE, LoadedAudio.backgroundMusic);
        this.loadAudio(ENGINE_SOUND_FILE, LoadedAudio.engine);
        this.loadAudio(DRIFT_SOUND_FILE, LoadedAudio.drift);
        this.loadAudio(CRASH_PATH_1, LoadedAudio.collision1);
        this.loadAudio(CRASH_PATH_2, LoadedAudio.collision2);
        this.loadAudio(CRASH_PATH_3, LoadedAudio.collision3);
        this.loadAudio(CRASH_PATH_4, LoadedAudio.collision4);
        this.loadAudio(CRASH_PATH_5, LoadedAudio.collision5);
    }

    private startLoadSkybox(): void {
        this.loadCubeTexture(
            DAY_SKYBOX_FOLDER,
            SKYBOX_FILES,
            LoadedCubeTexture.daySkyBox
        );
        this.loadCubeTexture(
            NIGHT_SKYBOX_FOLDER,
            SKYBOX_FILES,
            LoadedCubeTexture.nightSkyBox
        );
    }
}
