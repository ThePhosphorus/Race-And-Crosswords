import {AudioListener, Object3D} from "three";
import { PositionalSoundFacade } from "./positional-sound-facade";
import { CRASH_PATH_1, CRASH_PATH_2, CRASH_PATH_3, CRASH_PATH_4, CRASH_VOLUME } from "../sound-constants";
import { DEFAULT_VOLUME } from "../../../race.constants";

const ENGINE_FILE_NAME: string = "./engine/engine2.ogg";
const DRIFT_FILE_NAME: string = "./drift/drift1.ogg";
const MAX_RPM: number = 6500;
const MIN_RPM: number = 800;
const PLAYBACK_SPEED_FACTOR: number = 2;
const ENGINE_VOLUME: number = 1;

export class CarSounds {

    private _engine: PositionalSoundFacade;
    private _drift: PositionalSoundFacade;
    private _collisionSounds: Array<PositionalSoundFacade>;

    public constructor(soundEmittingObject: Object3D, soundListener: AudioListener, sourcePath?: string) {
        this._engine = new PositionalSoundFacade(soundEmittingObject, soundListener, true, ENGINE_VOLUME);
        this._drift = new PositionalSoundFacade(soundEmittingObject, soundListener, true, DEFAULT_VOLUME);
        this._engine.init(ENGINE_FILE_NAME, sourcePath).then(() => this._engine.play());
        this._drift.init(DRIFT_FILE_NAME, sourcePath).then(() => this._drift.setVolume(2));
        this.initCollisionSounds(soundEmittingObject, soundListener);
    }
    private initCollisionSounds(soundEmittingObject: Object3D, soundListener: AudioListener, sourcePath?: string): void {
        this._collisionSounds = new Array<PositionalSoundFacade>();
        const crash1: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false, DEFAULT_VOLUME);
        const crash2: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false, DEFAULT_VOLUME);
        const crash3: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false, DEFAULT_VOLUME);
        const crash4: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false, DEFAULT_VOLUME);
        const crash5: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false, DEFAULT_VOLUME);
        let n: number = 0;
        crash1.init(CRASH_PATH_1, sourcePath).then( () => this._collisionSounds[n++].setVolume(1));
        crash2.init(CRASH_PATH_2, sourcePath).then( () => this._collisionSounds[n++].setVolume(CRASH_VOLUME));
        crash3.init(CRASH_PATH_3, sourcePath).then( () => this._collisionSounds[n++].setVolume(CRASH_VOLUME));
        crash4.init(CRASH_PATH_4, sourcePath).then( () => this._collisionSounds[n++].setVolume(CRASH_VOLUME));
        crash5.init(CRASH_PATH_4, sourcePath).then( () => this._collisionSounds[n++].setVolume(CRASH_VOLUME));
        this._collisionSounds.push(crash1);
        this._collisionSounds.push(crash2);
        this._collisionSounds.push(crash3);
        this._collisionSounds.push(crash4);
        this._collisionSounds.push(crash5);
    }
    public updateRPM(rpm: number): void {
        this._engine.setPlaybackRate(this.getPlaybackRate(rpm));
    }
    private getPlaybackRate(rpm: number): number {
        return (rpm - MIN_RPM) / (MAX_RPM - MIN_RPM) + PLAYBACK_SPEED_FACTOR;
    }
    public stop(): void {
        this._engine.stop();
    }

    public startDrift(): void {
        if (!this._drift.isPlaying()) {
            this._drift.play();
        }
    }

    public playCollision(): void {
        let noSoundPlaying: boolean = true;
        this._collisionSounds.forEach((sound) => { if (sound.isPlaying()) {
            noSoundPlaying = false;
        }});
        if (noSoundPlaying) {
            const index: number = Math.floor(Math.random() * this._collisionSounds.length);
            this._collisionSounds[index].play();
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
