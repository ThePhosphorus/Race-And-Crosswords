
import { AudioBuffer, AudioListener, Audio } from "three";
import { LoaderService } from "../../loader-service/loader.service";
import { LoadedAudio } from "../../loader-service/load-types.enum";

export abstract class AbstractSoundFacade {
    protected sound: Audio;
    public constructor(soundListener: AudioListener, private _isLoop: boolean, private _volume: number) {
        this.instanciateSound(soundListener);
    }

    protected abstract instanciateSound(soundListener: AudioListener): void;

    public init(loader: LoaderService, type: LoadedAudio): void {
        this.setSoundSettings(loader.getAudio(type));
    }

    protected setSoundSettings(buffer: AudioBuffer): void {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(this._isLoop);
        this.sound.setVolume(this._volume);
    }

    public setVolume(volume: number): void {
        this.sound.setVolume(volume);
    }

    public setPlaybackRate(playBackRate: number): void {
        this.sound.setPlaybackRate(playBackRate);
    }

    public play(): void {
        if (!this.sound.isPlaying) {
            this.sound.play();
        }
    }

    public isPlaying(): boolean {
        return this.sound.isPlaying;
    }

    public stop(): void {
        if (this.sound != null) {
            this.sound.stop();
        }
    }
}
