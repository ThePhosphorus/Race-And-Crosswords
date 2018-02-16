
import {
    PositionalAudio,
    AudioLoader,
    AudioBuffer,
    Object3D,
    AudioListener
} from "three";

const DEFAULT_SOUND_PATH: string = "../../assets/sounds/";
export const DEFAULT_VOLUME: number = 2;

export abstract class AbstractSoundContainer {

    protected sound: PositionalAudio;

    public constructor(soundEmittingObject: Object3D, soundListener: AudioListener, sourcePath?: string) {
        this.sound = new PositionalAudio(soundListener);
        let soundPath: string = sourcePath ? sourcePath : DEFAULT_SOUND_PATH;
        soundPath += this.getFileName();
        this.loadSound(soundPath)  ;
        soundEmittingObject.add(this.sound);
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
