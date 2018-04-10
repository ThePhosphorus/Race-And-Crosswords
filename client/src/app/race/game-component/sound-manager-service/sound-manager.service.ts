import { Injectable } from "@angular/core";
import {
    AudioListener
} from "three";
import { GlobalSoundFacade } from "./sound-facades/global-sound-facade";
import { START_VOLUME, MUSIC_VOLUME } from "./sound-constants";
import { LoaderService } from "../loader-service/loader.service";
import { LoadedAudio } from "../loader-service/load-types.enum";

@Injectable()
export class SoundManagerService {

    private _audioListener: AudioListener;
    private _startSound: GlobalSoundFacade;
    private _music: GlobalSoundFacade;

    public constructor(private loader: LoaderService) {
    }

    public startRace(): void {
          this._startSound = new GlobalSoundFacade(this._audioListener, false, START_VOLUME);
          this._startSound.init(this.loader, LoadedAudio.start);
          this._music = new GlobalSoundFacade(this._audioListener, true, MUSIC_VOLUME);
          this._music.init(this.loader, LoadedAudio.backgroundMusic);
          this._music.play();
    }

    public init(audioListener: AudioListener): void {
        this._audioListener = audioListener;
    }

    public playStartingSound(): void {
        if (!this._startSound.isPlaying()) {
            this._startSound.play();
        }
    }

    public stopAllSounds(): void {
    }

}
