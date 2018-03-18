import {AudioListener, Object3D} from "three";
import { PositionalSoundFacade } from "./positional-sound-facade";

const ENGINE_FILE_NAME: string = "./engine/idle.ogg";
const DRIFT_FILE_NAME: string = "./drift/drift2.ogg";
const MAX_RPM: number = 5500;
const MIN_RPM: number = 800;
const PLAYBACK_SPEED_FACTOR: number = 2;

export class CarSounds {

    private engine: PositionalSoundFacade;
    private _drift: PositionalSoundFacade;

    public constructor(soundEmittingObject: Object3D, soundListener: AudioListener, sourcePath?: string) {
        this.engine = new PositionalSoundFacade(soundEmittingObject, soundListener, true);
        this._drift = new PositionalSoundFacade(soundEmittingObject, soundListener, false);
        this.engine.init(ENGINE_FILE_NAME, sourcePath).then(() => this.engine.play());
        this._drift.init(DRIFT_FILE_NAME, sourcePath).then(() => this._drift.setVolume(2));
    }
    public updateRPM(rpm: number): void {
        this.engine.setPlaybackRate(this.getPlaybackRate(rpm));
    }
    private getPlaybackRate(rpm: number): number {
        return (rpm - MIN_RPM) / (MAX_RPM - MIN_RPM) + PLAYBACK_SPEED_FACTOR;
    }
    public stop(): void {
        this.engine.stop();
    }

    public startDrift(): void {
        if (!this._drift.isPlaying()) {
            this._drift.play();
        }
    }

    public get drift(): PositionalSoundFacade {
        return this._drift;
    }

    public releaseDrift(): void {
        if (this._drift != null) {
            this._drift.stop();
        }
    }
}
