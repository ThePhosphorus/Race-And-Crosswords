import { Injectable } from "@angular/core";
import { DefaultLoadingManager } from "three";

@Injectable()
export class LoaderServiceService {

    public constructor() {}

    public setCallbacks(): void {
        DefaultLoadingManager.onStart = () => console.log("started The Loading");
        DefaultLoadingManager.onLoad = () => console.log("loaded");
        DefaultLoadingManager.onProgress = (item: string, loaded: number, total: number) =>
            console.log("Loading " + item + ". " + loaded + "/ " + total);
        DefaultLoadingManager.onError = () => console.error("There was an error while loading");
    }
}
