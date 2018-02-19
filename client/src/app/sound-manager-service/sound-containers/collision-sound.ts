import { AbstractSoundContainer, DEFAULT_VOLUME } from "./abstract-sound-container";
import { AudioBuffer, Object3D, AudioListener } from "three";

const FILE_NAME: string = "collision.ogg";
export class Collision extends AbstractSoundContainer {

    public constructor(
        soundEmittingObject: Object3D,
        soundListener: AudioListener,
        sourcePath?: string,
        private customFileName?: string) {
        super(soundEmittingObject, soundListener, sourcePath);
    }

    public play(): void {
        this.sound.play();
    }

    protected setSoundSettings(buffer: AudioBuffer): void {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(false);
        this.sound.setVolume(DEFAULT_VOLUME);
    }

    protected getFileName(): string {
        return this.customFileName ? this.customFileName : FILE_NAME;
    }
}
