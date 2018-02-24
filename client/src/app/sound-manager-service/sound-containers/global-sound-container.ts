import {
    Audio,
    AudioListener
} from "three";

import {AbstractSoundContainer} from "./abstract-sound-container";

export class GlobalSoundContainer extends AbstractSoundContainer {

    public constructor(
        soundListener: AudioListener,
        isLoop: boolean) {
        super(soundListener, isLoop);
    }

    protected instanciateSound(soundListener: AudioListener): void {
        this.sound = new Audio(soundListener);
    }
}