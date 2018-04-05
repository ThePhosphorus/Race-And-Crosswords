import {AudioListener, Object3D} from "three";
import { PositionalSoundFacade } from "./positional-sound-facade";
import { DEFAULT_VOLUME } from "../../../race.constants";
import { LoaderService } from "../../loader-service/loader.service";
import { LoadedAudio } from "../../loader-service/load-types.enum";
import { CRASH_VOLUME } from "../sound-constants";

const MAX_RPM: number = 6500;
const MIN_RPM: number = 800;
const PLAYBACK_SPEED_FACTOR: number = 2;
const ENGINE_VOLUME: number = 1;

export class CarSounds {

    private _engine: PositionalSoundFacade;
    private _drift: PositionalSoundFacade;
    private _collisionSounds: Array<PositionalSoundFacade>;

    public constructor(soundEmittingObject: Object3D, soundListener: AudioListener, private loader: LoaderService) {
        this._engine = new PositionalSoundFacade(soundEmittingObject, soundListener, true, ENGINE_VOLUME);
        this._drift = new PositionalSoundFacade(soundEmittingObject, soundListener, true, DEFAULT_VOLUME);

        this._engine.init(this.loader, LoadedAudio.engine);
        this._engine.play();

        this._drift.init(this.loader, LoadedAudio.drift);
        this._drift.setVolume(2);

        this.initCollisionSounds(soundEmittingObject, soundListener);
    }
    private initCollisionSounds(soundEmittingObject: Object3D, soundListener: AudioListener, sourcePath?: string): void {
        this._collisionSounds = new Array<PositionalSoundFacade>();
        const crash1: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false, DEFAULT_VOLUME);
        const crash2: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false, DEFAULT_VOLUME);
        const crash3: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false, DEFAULT_VOLUME);
        const crash4: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false, DEFAULT_VOLUME);
        const crash5: PositionalSoundFacade = new PositionalSoundFacade(soundEmittingObject, soundListener, false, DEFAULT_VOLUME);

        crash1.init(this.loader, LoadedAudio.collision1);
        crash2.init(this.loader, LoadedAudio.collision2);
        crash3.init(this.loader, LoadedAudio.collision3);
        crash4.init(this.loader, LoadedAudio.collision4);
        crash5.init(this.loader, LoadedAudio.collision5);

        this._collisionSounds.push(crash1);
        this._collisionSounds.push(crash2);
        this._collisionSounds.push(crash3);
        this._collisionSounds.push(crash4);
        this._collisionSounds.push(crash5);

        this._collisionSounds.forEach((sound: PositionalSoundFacade) => sound.setVolume(CRASH_VOLUME));
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
