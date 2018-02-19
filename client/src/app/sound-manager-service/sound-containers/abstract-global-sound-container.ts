
import {
    AudioLoader,
    AudioBuffer,
    AudioListener,
    Audio
} from "three";

const DEFAULT_SOUND_PATH: string = "../../assets/sounds/";
export const DEFAULT_VOLUME: number = 0.5;

export abstract class AbstractGlobalSoundContainer {

    protected sound: Audio;

    public constructor(soundListener: AudioListener, sourcePath?: string) {
        this.sound = new Audio(soundListener);
        let soundPath: string = sourcePath ? sourcePath : DEFAULT_SOUND_PATH;
        soundPath += this.getFileName();
        this.loadSound(soundPath);
    }

    protected loadSound(path: string): void {
        const idleLoader: AudioLoader = new AudioLoader();
        idleLoader.load(path, (buffer: AudioBuffer) => {
            this.setSoundSettings(buffer);
            },          () => { } , () => { });

    }

    public stop(): void {
        this.sound.stop();
    }

    protected abstract setSoundSettings(buffer: AudioBuffer): void;

    protected abstract getFileName(): string;
}
