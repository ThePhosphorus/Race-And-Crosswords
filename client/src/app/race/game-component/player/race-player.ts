import { Car } from "../car/car";
import { Vector3, AudioListener } from "three";
import { LoaderService } from "../loader-service/loader.service";
import { LoadedObject } from "../loader-service/load-types.enum";
import { TrackPosition } from "./track-position/track-position";

export abstract class RacePlayer {
    public constructor(public car: Car) { }

    public abstract init(position: Vector3,
                         loader: LoaderService,
                         type: LoadedObject,
                         audioListener: AudioListener,
                         track: TrackPosition): void;

    public abstract update(deltaTime: number): void;
}
