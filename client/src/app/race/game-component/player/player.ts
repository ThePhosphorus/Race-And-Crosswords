import { Car } from "../car/car";
import { Vector3 } from "three";

export abstract class RacePlayer {
    public constructor(public car: Car) { }

    public async abstract init(position: Vector3, color: string): Promise<void>;

    public abstract update(deltaTime: number): void;
}
