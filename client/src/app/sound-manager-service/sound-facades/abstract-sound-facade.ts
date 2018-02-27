
import { AudioLoader, AudioBuffer, AudioListener, Audio } from "three";

const DEFAULT_SOUND_PATH: string = "../../assets/sounds/";
export const DEFAULT_VOLUME: number = 0.5;

export abstract class AbstractSoundFacade {
    private isLoop: boolean;
    protected sound: Audio;
    public constructor(soundListener: AudioListener, isLoop: boolean) {
        this.instanciateSound(soundListener);
        this.isLoop = isLoop;
    }

    protected abstract instanciateSound(soundListener: AudioListener): void;

    public async init(fileName: string, sourcePath?: string): Promise<void> {
        let path: string = sourcePath ? sourcePath : DEFAULT_SOUND_PATH;
        path += fileName;

        return this.loadSound(path).then((buffer) => this.setSoundSettings(buffer));
    }

    protected async loadSound(path: string): Promise<AudioBuffer> {
        return new Promise<AudioBuffer>((resolve, reject) => {
            new AudioLoader().load(path, (buffer: AudioBuffer) => {
                resolve(buffer);
            },
                                   () => { }, () => { });
        });
    }
    protected setSoundSettings(buffer: AudioBuffer): void {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(this.isLoop);
        this.sound.setVolume(DEFAULT_VOLUME);
    }

    public setVolume(volume: number): void {
        this.sound.setVolume(volume);
    }

    public setPlaybackRate(playBackRate: number): void {
        this.sound.setPlaybackRate(playBackRate);
    }

    public play(): void {
        this.sound.play();
    }
    public stop(): void {
        this.sound.stop();
    }
}