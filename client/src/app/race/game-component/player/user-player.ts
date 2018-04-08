import { RacePlayer } from "./player";
import { Car } from "../car/car";
import { Vector3 } from "three";

export class UserPlayer extends RacePlayer {
    public constructor(car: Car) {
        super(car);
    }

    public async init(position: Vector3, color: string): Promise<void> {
        await this.car.init(position, color);
    }

    public update(deltaTime: number): void {
        this.car.update(deltaTime);
    }
}
