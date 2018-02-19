import {
    PositionalAudio,
    AudioListener,
    Object3D
} from "three";

import {
    AbstractSoundContainer
} from "./abstract-sound-container";

export abstract class AbstractPositionalSoundContainer extends AbstractSoundContainer {

    public constructor(
        soundEmittingObject: Object3D,
        soundListener: AudioListener,
        sourcePath?: string) {
        super(soundListener, sourcePath);
        soundEmittingObject.add(this.sound);
    }

    protected sound: PositionalAudio;

    protected instanciateSound(soundListener: AudioListener): void {
        this.sound = new PositionalAudio(soundListener);
    }
    public stop(): void {
        this.sound.stop();
    }
}
