import { Car } from "../car/car";
import { Vector3, AudioListener } from "three";
import { LoaderService } from "../loader-service/loader.service";
import { LoadedObject } from "../loader-service/load-types.enum";
import { TrackPosition } from "./track-position/track-position";
import { PLAYER_NAMES } from "../../../global-constants/constants";

const DEFAULT_NAME: string = "Player";

export abstract class RacePlayer {
    private _track: TrackPosition;
    private _lap: number;
    private _lastTrackIndex: number;
    private _lapTimes: Array<number>;
    private _distanceOnTrack: number;
    protected _name: string;

    public constructor(public car: Car) {
        this._track = null;
        this._distanceOnTrack = 0;
        this._lastTrackIndex = 0;
        this._name = DEFAULT_NAME;
        this.initializeLap();
    }

    public get track(): TrackPosition {
        return this._track;
    }

    public get lap(): number {
        return this._lap;
    }

    public get distanceOnTrack(): number {
        return this._distanceOnTrack;
    }

    public get lapTimes(): Array<number> {
        return this._lapTimes;
    }

    public get name(): string {
        return this._name;
    }

    public init(position: Vector3,
                loader: LoaderService,
                type: LoadedObject,
                audioListener: AudioListener,
                track: TrackPosition): void {
        this._name = PLAYER_NAMES.get(type);
        this._track = track;
        this._lastTrackIndex = track != null ? this._track.length - 1 : 0;
        this.onInit(position, loader, type, audioListener);
    }

    public update(deltaTime: number): void {
        this._lapTimes[this._lapTimes.length - 1] += deltaTime;
        this.calculateLap();
        this.calculateDistanceOnTrack();
        this.onUpdate(deltaTime);
    }

    protected abstract onInit(position: Vector3,
                              loader: LoaderService,
                              type: LoadedObject,
                              audioListener: AudioListener): void;

    protected abstract onUpdate(deltaTime: number): void;

    private initializeLap(): void {
        this._lap = 0;
        this._lapTimes = new Array<number>();
        this._lapTimes.push(0);
    }

    private calculateLap(): void {
        if (this._track == null) {
            return;
        }

        const trackIndex: number = this._track.findClosestNextPointIndex(this.car.getPosition());
        const deltaTrack: number = this._lastTrackIndex - trackIndex;
        this._lastTrackIndex = trackIndex;

        if (Math.abs(deltaTrack) > this._track.length / 2) {
            this._lap += Math.sign(deltaTrack);
            if (this._lap > this._lapTimes.length) {
                this._lapTimes.push(0);
            }
        }
    }

    private calculateDistanceOnTrack(): void {
        this._distanceOnTrack = (this._track != null) ?
            this._track.findDistanceOnTrack(this.car.getPosition()) + this._lap * this._track.trackLength : 0;
    }
}
