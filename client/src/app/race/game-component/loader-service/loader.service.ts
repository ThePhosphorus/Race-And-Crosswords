import { Injectable } from "@angular/core";
import { DefaultLoadingManager, Object3D, Audio, Texture, CubeTexture } from "three";
import { LoadedObjects, LoadedAudios, LoadedTextures, LoadedCubeTextures } from "./load-types.enum";

@Injectable()
export class LoaderService {

    private objects: Array<Object3D>;
    private audios: Array<Audio>;
    private textures: Array<Texture>;
    private cubeTextures: Array<CubeTexture>;

    public constructor() {}

    public setCallbacks(): void {
        DefaultLoadingManager.onStart = () => console.log("started The Loading");
        DefaultLoadingManager.onLoad = () => console.log("loaded");
        DefaultLoadingManager.onProgress = (item: string, loaded: number, total: number) =>
            console.log("Loading " + item + ". " + loaded + "/ " + total);
        DefaultLoadingManager.onError = () => console.error("There was an error while loading");
    }

    public loadObject(path: string, type: LoadedObjects): void {
        // Load the object
    }

    public loadAudio(path: string, type: LoadedAudios): void {
        // Load the Audio
    }

    private loadTexture(path: string, type: LoadedTextures): void {
        // Load the texture
    }

    private loadCubeTexture(path: string, files: Array<string>, type: LoadedCubeTextures): void {
        // Load the cube Texture
    }
}
