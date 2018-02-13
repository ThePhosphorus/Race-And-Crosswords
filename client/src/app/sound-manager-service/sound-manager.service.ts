import { Injectable } from "@angular/core";
import {
    Audio,
    AudioLoader,
    AudioBuffer,
} from "three";
import { CameraManagerService } from "./../camera-manager-service/camera-manager.service";

@Injectable()
export class SoundManagerService {
    public context: AudioContext;
    public isPlaying: boolean = false;
    public loadComplete: boolean = false;
    public xhr: XMLHttpRequest;

    public buffer: AudioBuffer;
    public source: AudioBufferSourceNode;

    public constructor() {
        try {
            this.context = new AudioContext();
        }

        catch (e) {
            console.log("no audio");
        }
    }

    public loadFile = (fileName: string) => {
        if (this.context === undefined) {
            return;
        }
        this.xhr = new XMLHttpRequest();
        this.xhr.open("GET", fileName, true);
        this.xhr.responseType = "arraybuffer";
        this.xhr.onload = this.onLoadComplete;
    }

    public onLoadComplete = (ev: Event): any => {
        this.xhr = ev.currentTarget as XMLHttpRequest;
        this.context.decodeAudioData(this.xhr.response, this.decodeData);
    }

    public decodeData = (buffer: AudioBuffer): void => {
        this.buffer = buffer;
        this.loadComplete = true;
    }

    public play = (startTime: number, duration: number) => {
        if (this.context === undefined) {
            return;
        }

        if (this.loadComplete === false) {
            return;
        }

        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.context.destination);
        this.source.start(this.context.currentTime, startTime, duration);

    }
    /*private engineLoop: Audio;
    private context: AudioContext;

    public constructor(private cameraManager: CameraManagerService) {
        this.init();
    }
    private init(): void {
        const tmpLoop: Audio = this.engineLoop = new Audio(this.cameraManager.listener);
        const idleLoader: AudioLoader = new AudioLoader();
        idleLoader.load("../../assets/sounds/idle.ogg", (buffer: AudioBuffer) => {
            tmpLoop.setBuffer(buffer);
            tmpLoop.setLoop(true);
            tmpLoop.setVolume(0.5);
        }, () => { }, () => { });*/

}

    public modifyPlayBackSpeed(rpm: number): void {
    if(rpm > 800) {
        this.engineLoop.pause();
        this.engineLoop.setPlaybackRate((rpm - 800) / 4700 + 1);
        this.engineLoop.play();
    } else {
        this.engineLoop.playbackRate = 1;
    }
}
    public startSounds(): void {
    this.engineLoop.play();
}

}
