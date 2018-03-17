import {AudioListener, Object3D} from "three";
import { PositionalSoundFacade } from "./positional-sound-facade";

const FILE_NAME: string = "idle.ogg";
const MAX_RPM: number = 5500;
const MIN_RPM: number = 800;
const PLAYBACK_SPEED_FACTOR: number = 2;
const ENGINE_VOLUME: number = 1;

export class CarSounds {

    public engine: PositionalSoundFacade;

    public constructor(soundEmittingObject: Object3D, soundListener: AudioListener, sourcePath?: string) {
        this.engine = new PositionalSoundFacade(soundEmittingObject, soundListener, true, ENGINE_VOLUME);
        this.engine.init(FILE_NAME, sourcePath).then(() => this.engine.play());
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
}
