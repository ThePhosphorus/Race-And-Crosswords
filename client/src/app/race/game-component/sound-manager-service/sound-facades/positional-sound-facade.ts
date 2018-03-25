import {PositionalAudio, AudioListener, Object3D} from "three";

import {
    AbstractSoundFacade
} from "./abstract-sound-facade";

export  class PositionalSoundFacade extends AbstractSoundFacade {

    public constructor(
        soundEmittingObject: Object3D,
        soundListener: AudioListener,
        isLoop: boolean,
        volume: number) {
        super(soundListener, isLoop, volume);
        soundEmittingObject.add(this.sound);
    }

    protected instanciateSound(soundListener: AudioListener): void {
        this.sound = new PositionalAudio(soundListener);
    }
}
