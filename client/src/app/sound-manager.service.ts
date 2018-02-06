import { Injectable } from "@angular/core";
import {
    Object3D,
    ObjectLoader,
    Audio,
    AudioLoader,
    AudioBuffer,
    AudioListener
} from "three";
import { CameraManagerService } from "./camera-manager-service/camera-manager.service";

@Injectable()
export class SoundManagerService {

    public constructor() {
    private cameraManager: CameraManagerService;
}

    private idleSound: Audio;
    private loadSounds(): void {
    const tmpIdle: Audio = this.idleSound = new Audio(this.cameraManager.listener);

    const idleLoader: AudioLoader = new AudioLoader();
    idleLoader.load("../../assets/sounds/idle.ogg",
        (buffer: AudioBuffer) => {
            tmpIdle.setBuffer(buffer);
            tmpIdle.setLoop(true);
            tmpIdle.setVolume(0.5);
        },
        () => { },
        () => { });
    }
}
