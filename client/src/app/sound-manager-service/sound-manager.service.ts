import { Injectable } from "@angular/core";
import {
    AudioListener
} from "three";
import {CarSounds} from "./sound-containers/car-sounds";
// import {StartSound} from "./sound-containers/start-sound";
import { Car } from "../car/car";
// import { GlobalSoundContainer } from "./sound-containers/global-sound-container";
// import { BackgroundMusic } from "./sound-containers/background-music";
// const path: string = "starting.ogg";
@Injectable()
export class SoundManagerService {

    private cars: Map<Number, CarSounds>;
    private listener: AudioListener;
    // private startSound: GlobalSoundContainer;
    // private bgm: BackgroundMusic;

    public constructor() {
        this.cars = new Map<Number, CarSounds>();
    }

    public startRace(): void {
        //  this.startSound = new GlobalSoundContainer(this.listener, false, path);
        //  this.startSound.play();
    }
    public addCarSound(car: Car): void {
        this.cars.set(car.id, new CarSounds(car.carMesh, this.listener));
    }

    public updateCarRpm(id: number, rpm: number): void {
        this.cars.get(id).updateRPM(rpm);
    }

    // public collide(carId: number): void {
    //     this.cars.get(carId).collision.play();
    // }

    // public startDrift(carId: number): void {
    //     this.cars.get(carId).drift.start();
    // }

    // public endDrift(carId: number): void {
    //     this.cars.get(carId).drift.stop();
    // }

    public init(listener: AudioListener): void {
        this.listener = listener;
        // this.bgm = new BackgroundMusic(listener);
    }

    public stopAllSounds(): void {
        this.cars.forEach((car: CarSounds) => {
            car.stop();
            // this.startSound.stop();
            // this.bgm.stop();

        });
    }

}
