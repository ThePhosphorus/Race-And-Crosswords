import { Injectable } from "@angular/core";
import {
    AudioListener
} from "three";
import {CarSounds} from "./sound-containers/car-sounds";
import {StartSound} from "./sound-containers/start-sound";
import { Car } from "../car/car";

@Injectable()
export class SoundManagerService {

    private cars: CarSounds[];
    private listener: AudioListener;
    private startSound: StartSound;

    public constructor() {
        this.cars = new Array<CarSounds>();
    }

    public startRace(): void {
        this.startSound = new StartSound(this.listener);
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
