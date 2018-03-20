import {
    Audio,
    AudioListener
} from "three";

import {AbstractSoundFacade} from "./abstract-sound-facade";

export class GlobalSoundFacade extends AbstractSoundFacade {

    public constructor(
        soundListener: AudioListener,
        isLoop: boolean,
        volume: number) {
        super(soundListener, isLoop, volume);
    }

    protected instanciateSound(soundListener: AudioListener): void {
        this.sound = new Audio(soundListener);
    }
}
