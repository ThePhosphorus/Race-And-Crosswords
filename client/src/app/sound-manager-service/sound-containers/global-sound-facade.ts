import {
    Audio,
    AudioListener
} from "three";

import {AbstractSoundFacade} from "./abstract-sound-facade";

export class GlobalSoundFacade extends AbstractSoundFacade {

    public constructor(
        soundListener: AudioListener,
        isLoop: boolean) {
        super(soundListener, isLoop);
    }

    protected instanciateSound(soundListener: AudioListener): void {
        this.sound = new Audio(soundListener);
    }
}
