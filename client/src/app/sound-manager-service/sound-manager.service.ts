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
    private audioListener: AudioListener;
    private startSound: GlobalSoundContainer;

    public constructor() {
        this.cars = new Map<number, CarSounds>();
    }

    public startRace(): void {
          this.startSound = new GlobalSoundContainer(this.audioListener, false);
          this.startSound.init(startpath).then(() => this.startSound.play());
    }

    public addCarSound(car: Car): void {
        this.cars.set(car.id, new CarSounds(car.carMesh, this.audioListener));
    }

    public updateCarRpm(id: number, rpm: number): void {
        this.cars.get(id).updateRPM(rpm);
    }

    public init(audioListener: AudioListener): void {
        this.audioListener = audioListener;
    }

    public stopAllSounds(): void {
        this.cars.forEach((car: CarSounds) => {
            car.stop();
            this.startSound.stop();
        });
    }

}
