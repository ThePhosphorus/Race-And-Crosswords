import { Injectable } from "@angular/core";
import {
    AudioListener
} from "three";
import {CarSounds} from "./sound-facades/car-sounds";
import { Car } from "../car/car";
import { GlobalSoundFacade } from "./sound-facades/global-sound-facade";
const startpath: string = "./starting.ogg";
const START_VOLUME: number = 0.1;
@Injectable()
export class SoundManagerService {

    // private cars: Map<number, CarSounds>;
    private audioListener: AudioListener;
    private startSound: GlobalSoundFacade;

    public constructor() {
    }

    public startRace(): void {
          this.startSound = new GlobalSoundFacade(this.audioListener, false);
          this.startSound.init(startpath).then(() => {this.startSound.setVolume(START_VOLUME); this.startSound.play(); });
    }

    public addCarSound(car: Car): void {
        // this.cars.set(car.id, new CarSounds(car.carMesh, this.audioListener));
    }


    public init(audioListener: AudioListener): void {
        this.audioListener = audioListener;
    }

    public stopAllSounds(): void {
    }

}
