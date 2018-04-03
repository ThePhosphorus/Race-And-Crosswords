import { Injectable } from "@angular/core";
import { DefaultLoadingManager, Object3D, Audio, Texture, CubeTexture } from "three";
import { LoadedObject, LoadedAudio, LoadedTexture, LoadedCubeTexture } from "./load-types.enum";

@Injectable()
export class LoaderService {

    private _objects: Array<Object3D>;
    private _audios: Array<Audio>;
    private _textures: Array<Texture>;
    private _cubeTextures: Array<CubeTexture>;

    public constructor() {}

    public setCallbacks(): void {
        DefaultLoadingManager.onStart = () => console.log("started The Loading");
        DefaultLoadingManager.onLoad = () => console.log("loaded");
        DefaultLoadingManager.onProgress = (item: string, loaded: number, total: number) =>
            console.log("Loading " + item + ". " + loaded + "/ " + total);
        DefaultLoadingManager.onError = () => console.error("There was an error while loading");
    }

    public loadObject(path: string, type: LoadedObject): void {
        // Load the object
    }

    public loadAudio(path: string, type: LoadedAudio): void {
        // Load the Audio
    }

    private loadTexture(path: string, type: LoadedTexture): void {
        // Load the texture
    }

    private loadCubeTexture(path: string, files: Array<string>, type: LoadedCubeTexture): void {
        // Load the cube Texture
    }

    public getObject(type: LoadedObject): Object3D {
        return this._objects[type];
    }

    public getAudio(type: LoadedAudio): Audio {
        return this._audios[type];
    }
    public getTexture(type: LoadedTexture): Texture {
        return this._textures[type];
    }
    public getCubeTexture(type: LoadedCubeTexture): CubeTexture {
        return this._cubeTextures[type];
    }
}
