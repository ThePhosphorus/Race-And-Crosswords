import {
    Audio,
    AudioListener
} from "three";

import {
    AbstractSoundContainer
} from "./abstract-sound-container";

export abstract class AbstractGlobalSoundContainer extends AbstractSoundContainer {

    protected sound: Audio;

    protected instanciateSound(soundListener: AudioListener): void {
        this.sound = new Audio(soundListener);
    }
    public stop(): void {
        this.sound.stop();
    }
}
