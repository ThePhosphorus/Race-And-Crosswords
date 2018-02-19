import { Injectable } from "@angular/core";
import {
    AudioListener
} from "three";
import {EngineSound} from "./sound-containers/engine-sound";
import {StartSound} from "./sound-containers/start-sound";
import { Car } from "../car/car";

@Injectable()
export class SoundManagerService {

    private cars: EngineSound[];
    private listener: AudioListener;
    private startSound: StartSound;

    public constructor() {
        this.cars = new Array<EngineSound>();
    }

    public startRace(): void {
        this.startSound = new StartSound(this.listener);
    }
    public addCarSound(car: Car): void {
        this.cars.push(new EngineSound(car.carMesh, this.listener));
    }

    public updateCarRpm(rpm: number): void {
        this.cars[0].updateRPM(rpm);
    }

    public init(listener: AudioListener): void {
        this.listener = listener;
    }

    public stopAllSounds(): void {
        this.cars.forEach((car: EngineSound) => {
            car.stop();
        });
    }

}
