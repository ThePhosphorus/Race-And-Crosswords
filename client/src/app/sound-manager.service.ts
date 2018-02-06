import { Injectable } from "@angular/core";
import {
    Object3D,
    ObjectLoader,
    Audio,
    AudioLoader,
    AudioBuffer,
    AudioListener
} from "three";

@Injectable()
export class SoundManagerService {

  constructor() {
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
