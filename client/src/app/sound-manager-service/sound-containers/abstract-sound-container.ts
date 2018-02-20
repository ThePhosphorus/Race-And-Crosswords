
import {
    AudioLoader,
    AudioBuffer,
    AudioListener
} from "three";

const DEFAULT_SOUND_PATH: string = "../../assets/sounds/";
export const DEFAULT_VOLUME: number = 0.5;

export abstract class AbstractSoundContainer {

    public constructor(soundListener: AudioListener, sourcePath?: string) {
        this.instanciateSound(soundListener);
        let soundPath: string = sourcePath ? sourcePath : DEFAULT_SOUND_PATH;
        soundPath += this.getFileName();
        this.loadSound(soundPath);
    }

    protected abstract instanciateSound(soundListener: AudioListener): void;

    protected loadSound(path: string): void {
        new AudioLoader().load(
            path,
            (buffer: AudioBuffer) => {
                this.setSoundSettings(buffer);
            },
            () => { },
            () => { });
    }

    public abstract stop(): void;

    protected abstract setSoundSettings(buffer: AudioBuffer): void;

    protected abstract getFileName(): string;
}
