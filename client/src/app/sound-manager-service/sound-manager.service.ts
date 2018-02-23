import { Injectable } from "@angular/core";
import {
    AudioListener
} from "three";
import {CarSounds} from "./sound-containers/car-sounds";
import { Car } from "../car/car";
import { GlobalSoundContainer } from "./sound-containers/global-sound-container";
const startpath: string = "starting.ogg";
@Injectable()
export class SoundManagerService {

    private cars: Map<number, CarSounds>;
    private listener: AudioListener;
    private startSound: GlobalSoundContainer;

    public constructor() {
        this.cars = new Map<number, CarSounds>();
    }

    public startRace(): void {
          this.startSound = new GlobalSoundContainer(this.listener, false);
          this.startSound.init(startpath).then(() => this.startSound.play());
    }

    public addCarSound(car: Car): void {
        this.cars.set(car.id, new CarSounds(car.carMesh, this.listener));
    }

    public updateCarRpm(id: number, rpm: number): void {
        this.cars.get(id).updateRPM(rpm);
    }

    public init(listener: AudioListener): void {
        this.listener = listener;
    }

    public stopAllSounds(): void {
        this.cars.forEach((car: CarSounds) => {
            car.stop();
            this.startSound.stop();
        });
    }

}
