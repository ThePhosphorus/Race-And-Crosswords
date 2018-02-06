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

    private cameraManager: CameraManagerService;
    private engineLoop: Audio;

    public constructor() {
    this.init();
}
    private init(): void {
        const tmpLoop: Audio = this.engineLoop = new Audio(this.cameraManager.listener);
        const idleLoader: AudioLoader = new AudioLoader();
        idleLoader.load("../../assets/sounds/idle.ogg",
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
    public playSounds(): void{
        this.engineLoop.play();
    }

}
