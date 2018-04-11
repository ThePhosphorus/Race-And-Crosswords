import { Car } from "../car/car";
import { Vector3, AudioListener } from "three";
import { LoaderService } from "../loader-service/loader.service";
import { LoadedObject } from "../loader-service/load-types.enum";
import { TrackPosition } from "./track-position/track-position";

export abstract class RacePlayer {
    private _track: TrackPosition;
    private _lap: number;
    private _distanceOnTrack: number;
    private _lastTrackIndex: number;

    public constructor(public car: Car) {
        this._track = null;
        this._lap = 0;
        this._distanceOnTrack = 0;
        this._lastTrackIndex = 0;
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

    public init(position: Vector3,
                loader: LoaderService,
                type: LoadedObject,
                audioListener: AudioListener,
                track: TrackPosition): void {
        this._track = track;
        this._lastTrackIndex = this._track.length - 1;
        this.onInit(position, loader, type, audioListener);
    }

    public update(deltaTime: number): void {
        this.calculateLap();
        this.calculateDistanceOnTrack();
        this.onUpdate(deltaTime);
    }

    protected abstract onInit(position: Vector3,
                              loader: LoaderService,
                              type: LoadedObject,
                              audioListener: AudioListener): void;

    protected abstract onUpdate(deltaTime: number): void;

    private calculateLap(): void {
        if (this._track == null) {
            return;
        }

        const trackIndex: number = this._track.findClosestNextPointIndex(this.car.getPosition());
        const deltaTrack: number = this._lastTrackIndex - trackIndex;
        this._lastTrackIndex = trackIndex;

        if (Math.abs(deltaTrack) > this._track.length / 2) {
            this._lap += Math.sign(deltaTrack);
        }
    }

    private calculateDistanceOnTrack(): void {
        this._distanceOnTrack = (this._track != null) ?
            this._track.findDistanceOnTrack(this.car.getPosition()) + this._lap * this._track.trackLength : 0;
    }
}
