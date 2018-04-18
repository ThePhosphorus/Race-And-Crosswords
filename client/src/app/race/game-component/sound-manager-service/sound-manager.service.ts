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
    private _beep1: GlobalSoundFacade;
    private _beep2: GlobalSoundFacade;
    private _music: GlobalSoundFacade;

    public constructor(private loader: LoaderService) {
    }

    public startRace(): void {
          this._beep1 = new GlobalSoundFacade(this._audioListener, false, START_VOLUME);
          this._beep1.init(this.loader, LoadedAudio.beep1);
          this._beep2 = new GlobalSoundFacade(this._audioListener, false, START_VOLUME);
          this._beep2.init(this.loader, LoadedAudio.beep2);
          this._music = new GlobalSoundFacade(this._audioListener, true, MUSIC_VOLUME);
          this._music.init(this.loader, LoadedAudio.backgroundMusic);
          this._music.play();
    }

    public init(audioListener: AudioListener): void {
        this._audioListener = audioListener;
    }

    public playBeep(id: number): void {
       const son: GlobalSoundFacade = id === 1 ? this._beep1 : this._beep2;
       son.play();
    }

    public stopAllSounds(): void {
        this._music.stop();
        this._beep1.stop();
        this._audioListener.setMasterVolume(0);
    }

}
