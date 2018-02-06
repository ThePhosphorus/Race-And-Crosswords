import { Injectable } from "@angular/core";
import {
    Object3D,
    ObjectLoader,
    Audio,
    AudioLoader,
    AudioBuffer,
    AudioListener
} from "three";
import { CameraManagerService } from "./../camera-manager-service/camera-manager.service";

@Injectable()
export class SoundManagerService {

    public constructor() {
    private cameraManager: CameraManagerService;
}

    private idleSound: Audio;
    private loadSounds(): void {
    const tmpIdle: Audio = this.idleSound = new Audio(this.cameraManager.listener);
    }
}
