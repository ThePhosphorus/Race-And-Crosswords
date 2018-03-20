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

    private audioListener: AudioListener;
    private startSound: GlobalSoundFacade;
    private music: GlobalSoundFacade;

    public constructor() {
    }

    public startRace(): void {
          this.startSound = new GlobalSoundFacade(this.audioListener, false, START_VOLUME);
          this.startSound.init(startpath).then(() => this.startSound.play());
          this.music = new GlobalSoundFacade(this.audioListener, true, MUSIC_VOLUME);
          this.music.init(musicpath).then(() => this.music.play());
    }

    public init(audioListener: AudioListener): void {
        this.audioListener = audioListener;
    }

    public stopAllSounds(): void {
    }

}
