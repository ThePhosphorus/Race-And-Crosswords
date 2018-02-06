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
        const tmpLoop: Audio = this.engineLoop = new Audio(this.cameraManager.listener);
        const idleLoader: AudioLoader = new AudioLoader();
        idleLoader.load("../../assets/sounds/engine.ogg",
                        (buffer: AudioBuffer) => {
                            tmpLoop.setBuffer(buffer);
                            tmpLoop.setLoop(true);
                            tmpLoop.setVolume(0.5);
                        },
                        () => { },
                        () => { });
    }

    public calculatePlaybackSpeed(rpm: number): number{
        return 1;
    }
    public playSounds(): void {
        this.engineLoop.play();
    }

}
