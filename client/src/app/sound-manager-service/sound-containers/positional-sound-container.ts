import {PositionalAudio, AudioListener, Object3D} from "three";

import {
    AbstractSoundContainer
} from "./abstract-sound-container";

export  class PositionalSoundContainer extends AbstractSoundContainer {

    public constructor(
        soundEmittingObject: Object3D,
        soundListener: AudioListener,
        isLoop: boolean) {
        super(soundListener, isLoop);
        soundEmittingObject.add(this.sound);
    }

    protected instanciateSound(soundListener: AudioListener): void {
        this.sound = new PositionalAudio(soundListener);
    }
}
