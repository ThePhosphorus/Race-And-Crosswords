import {AbstractGlobalSoundContainer, DEFAULT_VOLUME} from "./abstract-global-sound-container";
import { AudioBuffer} from "three";

const FILE_NAME: string = "starting.ogg";
export class StartSound extends AbstractGlobalSoundContainer {

    protected setSoundSettings(buffer: AudioBuffer): void {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(false);
        this.sound.setVolume(DEFAULT_VOLUME/8);
        this.sound.play();
    }
    protected getFileName(): string {
        return FILE_NAME;
    }
}
