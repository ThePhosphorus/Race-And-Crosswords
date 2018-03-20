import {AudioListener, Object3D} from "three";
import { PositionalSoundFacade } from "./positional-sound-facade";
import { CRASH_PATH_1, CRASH_PATH_2, CRASH_PATH_3, CRASH_PATH_4 } from "../sound-constants";

const ENGINE_FILE_NAME: string = "./engine/engine2.ogg";
const DRIFT_FILE_NAME: string = "./drift/drift1.ogg";
const MAX_RPM: number = 6500;
const MIN_RPM: number = 800;
const PLAYBACK_SPEED_FACTOR: number = 2;
const ENGINE_VOLUME: number = 1;

export class CarSounds {

    private engine: PositionalSoundFacade;
    private _drift: PositionalSoundFacade;
    private collisionSounds: Array<PositionalSoundFacade>;

    public constructor(soundEmittingObject: Object3D, soundListener: AudioListener, sourcePath?: string) {
        this.engine = new PositionalSoundFacade(soundEmittingObject, soundListener, true);
        this._drift = new PositionalSoundFacade(soundEmittingObject, soundListener, true);
        this.engine.init(ENGINE_FILE_NAME, sourcePath).then(() => this.engine.play());
        this._drift.init(DRIFT_FILE_NAME, sourcePath).then(() => this._drift.setVolume(2));
        this.initCollisionSounds(soundEmittingObject, soundListener);
    }
    private initCollisionSounds(soundEmittingObject: Object3D, soundListener: AudioListener, sourcePath?: string): void {
        this.collisionSounds = new Array<PositionalSoundFacade>();
        const crash1: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false);
        const crash2: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false);
        const crash3: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false);
        const crash4: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false);
        const crash5: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false);
        crash1.init(CRASH_PATH_1, sourcePath).then( () => this.collisionSounds[0].setVolume(1));
        crash2.init(CRASH_PATH_2, sourcePath).then( () => this.collisionSounds[1].setVolume(2));
        crash3.init(CRASH_PATH_3, sourcePath).then( () => this.collisionSounds[2].setVolume(2));
        crash4.init(CRASH_PATH_4, sourcePath).then( () => this.collisionSounds[3].setVolume(2));
        crash5.init(CRASH_PATH_4, sourcePath).then( () => this.collisionSounds[4].setVolume(2));
        this.collisionSounds.push(crash1);
        this.collisionSounds.push(crash2);
        this.collisionSounds.push(crash3);
        this.collisionSounds.push(crash4);
        this.collisionSounds.push(crash5);
    }
    public updateRPM(rpm: number): void {
        this.engine.setPlaybackRate(this.getPlaybackRate(rpm));
    }
    private getPlaybackRate(rpm: number): number {
        return (rpm - 800) / (MAX_RPM - MIN_RPM) + PLAYBACK_SPEED_FACTOR;
    }
    public stop(): void {
        this.engine.stop();
    }

    public startDrift(): void {
        if (!this._drift.isPlaying()) {
            this._drift.play();
        }
    }

    public playCollision(): void {
        let noSoundPlaying: boolean = true;
        this.collisionSounds.forEach((sound) => { if (sound.isPlaying()) {
            noSoundPlaying = false;
        }});
        if (noSoundPlaying) {
            const index: number = Math.floor(Math.random() * this.collisionSounds.length);
            this.collisionSounds[index].play();
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
