import { Injectable } from "@angular/core";
import {
    AudioListener
} from "three";
import {CarSounds} from "./sound-containers/car-sounds";
import { Car } from "../car/car";

@Injectable()
export class SoundManagerService {

    private cars: CarSounds[];
    private listener: AudioListener;

    public constructor() {
        this.cars = new Array<CarSounds>();
    }

    public addCarSound(car: Car): void {
        this.cars.push(new CarSounds(car.carMesh, this.listener));
    }

    public updateCarRpm(rpm: number): void {
        this.cars[0].engine.updateRPM(rpm);
    }

    public init(listener: AudioListener): void {
        this.listener = listener;
    }

    public stopAllSounds(): void {
        this.cars.forEach((car: CarSounds) => {
            car.stop();
        });
    }

}
