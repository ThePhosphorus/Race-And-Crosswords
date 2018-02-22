
import {
    AudioLoader,
    AudioBuffer,
    AudioListener,
    Audio
} from "three";

const DEFAULT_SOUND_PATH: string = "../../assets/sounds/";
export const DEFAULT_VOLUME: number = 0.5;

export abstract class AbstractSoundContainer {
    private isLoop: boolean;
    public sound: Audio;
    public constructor(soundListener: AudioListener, isLoop: boolean, fileName: string, sourcePath ?: string) {
        this.instanciateSound(soundListener);
        let path: string = sourcePath ? sourcePath : DEFAULT_SOUND_PATH;
        path += fileName;
        this.isLoop = isLoop;
        this.loadSound(path);
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
    protected setSoundSettings(buffer: AudioBuffer): void {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(this.isLoop);
        this.sound.setVolume(DEFAULT_VOLUME);
        console.log(this.sound.getVolume());
        this.sound.play();
    }

    public setVolume(volume: number): void {
        this.sound.setVolume(volume);
    }

    public play(): void {
         this.sound.play();
         console.log("test" + this.sound.getVolume());
    }
    public  stop(): void {
        this.sound.stop();
    }
}
