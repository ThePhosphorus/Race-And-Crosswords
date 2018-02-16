import { Injectable } from "@angular/core";
import {
    Audio,
    AudioLoader,
    AudioBuffer,
} from "three";
import { CameraManagerService } from "./../camera-manager-service/camera-manager.service";

@Injectable()
export class SoundManagerService {

    private engineLoop: Audio;

    public constructor(private cameraManager: CameraManagerService) {
        this.init();
    }
    private init(): void {
        this.engineLoop = new Audio(this.cameraManager.listener);
        const idleLoader: AudioLoader = new AudioLoader();
        idleLoader.load("../../assets/sounds/engine.ogg", (buffer: AudioBuffer) => {
            this.engineLoop.setBuffer(buffer);
            this.engineLoop.setLoop(true);
            this.engineLoop.setVolume(0.5);
            },          () => { } , () => { });

    }

    public modifyPlayBackSpeed(rpm: number): void {
        if (rpm > 800) {
            // this.engineLoop.stop();
            this.engineLoop.setPlaybackRate((rpm - 800) / 4700 + 1);
           // this.engineLoop.play();
        }
    }
    public startSounds(): void {
        this.engineLoop.play();
    }

}
