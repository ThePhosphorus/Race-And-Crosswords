import {DEFAULT_VOLUME} from "./abstract-sound-container";
import { AudioBuffer} from "three";
import { AbstractGlobalSoundContainer } from "./abstract-global-sound-container";

const FILE_NAME: string = "starting.ogg";
export class StartSound extends AbstractGlobalSoundContainer {

    protected setSoundSettings(buffer: AudioBuffer): void {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(false);
        this.sound.setVolume(DEFAULT_VOLUME / 2);
        this.sound.play();
    }
    protected getFileName(): string {
        return FILE_NAME;
    }
}
