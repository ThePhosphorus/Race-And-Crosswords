import {DEFAULT_VOLUME} from "./abstract-sound-container";

import {AbstractGlobalSoundContainer} from "./abstract-global-sound-container";
import {AudioBuffer} from "three";

const FILE_NAME: string = "bgm.ogg";
const BGM_ATTENUATION: number = 15;
export class BackgroundMusic extends AbstractGlobalSoundContainer {

    protected setSoundSettings(buffer: AudioBuffer): void {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(DEFAULT_VOLUME / BGM_ATTENUATION);
        this.sound.play();
    }

    protected getFileName(): string {
        return FILE_NAME;
    }
}
