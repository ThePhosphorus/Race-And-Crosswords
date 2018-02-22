// import {CollisionSound} from "./collision-sound";
// import {EngineSound} from "./engine-sound";
// import {DriftSound} from "./drift-sound";
import {AudioListener, Object3D} from "three";
import { PositionalSoundContainer } from "./positional-sound-container";

const FILE_NAME: string = "idle.ogg";
const MAX_RPM: number = 5500;
const MIN_RPM: number = 800;
const PLAYBACK_SPEED_FACTOR: number = 2;

export class CarSounds {

    public engine: PositionalSoundContainer;
    // public collision: CollisionSound;
    // public drift: DriftSound;

    public constructor(soundEmittingObject: Object3D, soundListener: AudioListener, sourcePath?: string) {
        this.engine = new PositionalSoundContainer(soundEmittingObject, soundListener, true);
        this.engine.init(FILE_NAME, sourcePath).then(() => this.engine.play());
        // this.collision = new CollisionSound(soundEmittingObject, soundListener, sourcePath);
        // this.drift = new DriftSound(soundEmittingObject, soundListener, sourcePath);
    }
    public updateRPM(rpm: number): void {
        this.engine.sound.setPlaybackRate(this.getPlaybackRate(rpm));
    }
    private getPlaybackRate(rpm: number): number {
        return (rpm - MIN_RPM) / (MAX_RPM - MIN_RPM) + PLAYBACK_SPEED_FACTOR;
    }
    public stop(): void {
        this.engine.stop();
        // this.collision.stop();
        // this.drift.stop();
    }
}
