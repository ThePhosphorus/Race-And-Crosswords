import { Injectable } from "@angular/core";
import {
    AudioListener
} from "three";
import { GlobalSoundFacade } from "./sound-facades/global-sound-facade";
import { START_VOLUME, MUSIC_VOLUME } from "./sound-constants";
const startpath: string = "starting.ogg";
const musicpath: string = "dejavu.ogg";
@Injectable()
export class SoundManagerService {

    private _audioListener: AudioListener;
    private _startSound: GlobalSoundFacade;
    private _music: GlobalSoundFacade;

    public constructor() {
    }

    public startRace(): void {
          this._startSound = new GlobalSoundFacade(this._audioListener, false, START_VOLUME);
          this._startSound.init(startpath).then(() => this._startSound.play());
          this._music = new GlobalSoundFacade(this._audioListener, true, MUSIC_VOLUME);
          this._music.init(musicpath).then(() => this._music.play());
    }

    public init(audioListener: AudioListener): void {
        this._audioListener = audioListener;
    }

    public stopAllSounds(): void {
    }

}
