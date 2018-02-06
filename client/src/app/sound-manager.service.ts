import { Injectable } from "@angular/core";
import {
    Object3D,
    ObjectLoader,
    Audio,
    AudioLoader,
    AudioBuffer
} from "three";

@Injectable()
export class SoundManagerService {

  constructor() { }

  private loadSounds(): void {
    const tmpIdle: Audio = this.idleSound = new Audio(this.cameraManager.listener);
    const tmpAccel: Audio = this.accelSound = new Audio(this.cameraManager.listener);

    const idleLoader: AudioLoader = new AudioLoader();
    idleLoader.load("../../assets/sounds/idle.ogg",
                    (buffer: AudioBuffer) => {
                        tmpIdle.setBuffer(buffer);
                        tmpIdle.setLoop(true);
                        tmpIdle.setVolume(0.5);
                    },
                    () => { },
                    () => { });
    const accelLoader: AudioLoader = new AudioLoader();
    accelLoader.load("../../assets/sounds/accel.ogg",
                     (buffer: AudioBuffer) => {
                        tmpAccel.setBuffer(buffer);
                        tmpAccel.setLoop(false);
                        tmpAccel.setVolume(0.5);
                     },
                     () => { },
                     () => { });
}
}
