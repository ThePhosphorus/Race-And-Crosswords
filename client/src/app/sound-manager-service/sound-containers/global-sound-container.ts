import {
    Audio,
    AudioListener
} from "three";

import {
    AbstractSoundContainer
} from "./abstract-sound-container";

export class GlobalSoundContainer extends AbstractSoundContainer {

    public constructor(
        soundListener: AudioListener,
        isLoop: boolean,
        fileName: string,
        sourcePath?: string) {
        super(soundListener, isLoop);
    }

    protected instanciateSound(soundListener: AudioListener): void {
        this.sound = new Audio(soundListener);
    }
    public stop(): void {
        this.sound.stop();
    }
}
