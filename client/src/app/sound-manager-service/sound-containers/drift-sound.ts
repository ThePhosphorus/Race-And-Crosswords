import {DEFAULT_VOLUME} from "./abstract-sound-container";
import { AudioBuffer} from "three";
import { AbstractPositionalSoundContainer } from "./abstract-positional-sound-container";

const FILE_NAME: string = "drift.ogg";
export class DriftSound extends AbstractPositionalSoundContainer {

    protected setSoundSettings(buffer: AudioBuffer): void {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(DEFAULT_VOLUME);
    }
    protected getFileName(): string {
        return FILE_NAME;
    }

    public start(): void {
        this.sound.play();
    }
}
