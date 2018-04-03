import { Injectable } from "@angular/core";
import {
    DefaultLoadingManager,
    Object3D,
    Audio,
    Texture,
    CubeTexture,
    ObjectLoader,
    AudioLoader,
    TextureLoader,
    CubeTextureLoader
} from "three";
import {
    LoadedObject,
    LoadedAudio,
    LoadedTexture,
    LoadedCubeTexture
} from "./load-types.enum";

const ASSETS: string = "../../assets/";

const CAR_FILE: string = ASSETS + "camero/yellow.json";

const SOUND_PATH: string = ASSETS + "sounds/";
const START_SOUND_FILE: string = SOUND_PATH + "starting.ogg";
const MUSIC_SOUND_FILE: string = SOUND_PATH + "dejavu.ogg";
const ENGINE_SOUND_FILE: string = SOUND_PATH + "engine/engine2.ogg";
const DRIFT_SOUND_FILE: string = SOUND_PATH + "drift/drift1.ogg";
const COLLISION_SOUNDS_PATH: string = SOUND_PATH + "crash";
const CRASH_PATH_1: string = COLLISION_SOUNDS_PATH + "/crash1.ogg";
const CRASH_PATH_2: string = COLLISION_SOUNDS_PATH + "/crash2.ogg";
const CRASH_PATH_3: string = COLLISION_SOUNDS_PATH + "/crash3.ogg";
const CRASH_PATH_4: string = COLLISION_SOUNDS_PATH + "/crash4.ogg";
const CRASH_PATH_5: string = COLLISION_SOUNDS_PATH + "/crash5.ogg";

const TEXTURE_PATH: string = ASSETS + "textures/";
const TRACK_TEXTURE_FILE: string = TEXTURE_PATH + "test.jpg";
const START_LINE_TEXTURE_FILE: string = TEXTURE_PATH + "linefixed.bmp";
const OFF_ROAD_TEXTURE_FILE: string = TEXTURE_PATH + "orange.jpg";

const SKYBOX_PATH: string = ASSETS + "skybox/";
const NIGHT_SKYBOX_FOLDER: string = SKYBOX_PATH + "sky3/";
const DAY_SKYBOX_FOLDER: string = SKYBOX_PATH + "sky1/";
const SKYBOX_FILES: string[] = [
    "posx.png",
    "negx.png",
    "posy.png",
    "negy.png",
    "posz.png",
    "negz.png"
];

@Injectable()
export class LoaderService {
    private _objects: Array<Object3D>;
    private _audios: Array<AudioBuffer>;
    private _textures: Array<Texture>;
    private _cubeTextures: Array<CubeTexture>;
    private _finished: boolean;

    public constructor() {
        this.init();
        this.setCallbacks();
    }

    public startLoading(): void {
        this.loadObject(CAR_FILE, LoadedObject.car);

        this.loadAudio(START_SOUND_FILE, LoadedAudio.start);
        this.loadAudio(MUSIC_SOUND_FILE, LoadedAudio.background_music);
        this.loadAudio(ENGINE_SOUND_FILE, LoadedAudio.engine);
        this.loadAudio(DRIFT_SOUND_FILE, LoadedAudio.drift);
        this.loadAudio(CRASH_PATH_1, LoadedAudio.collision1);
        this.loadAudio(CRASH_PATH_2, LoadedAudio.collision2);
        this.loadAudio(CRASH_PATH_3, LoadedAudio.collision3);
        this.loadAudio(CRASH_PATH_4, LoadedAudio.collision4);
        this.loadAudio(CRASH_PATH_5, LoadedAudio.collision5);

        this.loadTexture(TRACK_TEXTURE_FILE, LoadedTexture.track);
        this.loadTexture(START_LINE_TEXTURE_FILE, LoadedTexture.start);
        this.loadTexture(OFF_ROAD_TEXTURE_FILE, LoadedTexture.offRoad);

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

    public get isFinished(): boolean {
        return this._finished;
    }

    public getObject(type: LoadedObject): Object3D {
        return this._objects[type];
    }

    public getAudio(type: LoadedAudio): AudioBuffer {
        return this._audios[type];
    }
    public getTexture(type: LoadedTexture): Texture {
        return this._textures[type];
    }
    public getCubeTexture(type: LoadedCubeTexture): CubeTexture {
        return this._cubeTextures[type];
    }

    private init(): void {
        this._objects = new Array<Object3D>();
        this._audios = new Array<Audio>();
        this._textures = new Array<Texture>();
        this._cubeTextures = new Array<CubeTexture>();

        this._finished = false;

        this.clearArrays();
    }

    private clearArrays(): void {
        for (const objectType of Object.keys(LoadedObject)) {
            const type: number = Number(objectType);
            if (type) {
                this._objects[type] = null;
            }
        }

        for (const audioType of Object.keys(LoadedAudio)) {
            const type: number = Number(audioType);
            if (type) {
                this._audios[type] = null;
            }
        }

        for (const textureType of Object.keys(LoadedTexture)) {
            const type: number = Number(textureType);
            if (type) {
                this._textures[type] = null;
            }
        }

        for (const cubeTextureType of Object.keys(LoadedCubeTexture)) {
            const type: number = Number(cubeTextureType);
            if (type) {
                this._textures[type] = null;
            }
        }
    }

    private setCallbacks(): void {
        DefaultLoadingManager.onStart = () => this._finished = false;

        DefaultLoadingManager.onProgress = this.progressHandler;

        DefaultLoadingManager.onLoad = () => {
            this._finished = true;
        };

        DefaultLoadingManager.onError = this.errorHandler;

    }

    private loadObject(path: string, type: LoadedObject): void {
        new ObjectLoader(DefaultLoadingManager).load(
            path,
            (object: Object3D) => (this._objects[type] = object)
        );
    }

    private loadAudio(path: string, type: LoadedAudio): void {
        new AudioLoader(DefaultLoadingManager).load(
            path,
            (audio: AudioBuffer) => (this._audios[type] = audio),
            this.progressHandler,
            this.errorHandler
        );
    }

    private loadTexture(path: string, type: LoadedTexture): void {
        new TextureLoader(DefaultLoadingManager).load(
            path,
            (texture: Texture) => (this._textures[type] = texture)
        );
    }

    private loadCubeTexture(path: string, files: Array<string>, type: LoadedCubeTexture ): void {
        new CubeTextureLoader(DefaultLoadingManager).setPath(path).load(
            files,
            (cubeTexture: CubeTexture) => this._cubeTextures[type] = cubeTexture
        );
    }

    private errorHandler(): void {
        console.error("There was an error while loading");
    }

    private progressHandler(item: string, loaded: number, total: number): void {
        console.error("Loading " + item + ". " + loaded + "/ " + total);
    }
}
