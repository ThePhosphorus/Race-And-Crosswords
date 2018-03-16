import { Injectable } from "@angular/core";
import {
    AudioListener
} from "three";
import {CarSounds} from "./sound-facades/car-sounds";
import { Car } from "../car/car";
import { GlobalSoundFacade } from "./sound-facades/global-sound-facade";
import { START_VOLUME, MUSIC_VOLUME } from "./sound-constants";
const startpath: string = "starting.ogg";
const musicpath: string = "dejavu.ogg";
@Injectable()
export class SoundManagerService {

    private cars: Map<number, CarSounds>;
    private audioListener: AudioListener;
    private startSound: GlobalSoundFacade;
    private music: GlobalSoundFacade;

    public constructor() {
        this.cars = new Map<number, CarSounds>();
    }

    public startRace(): void {
          this.startSound = new GlobalSoundFacade(this.audioListener, false, START_VOLUME);
          this.startSound.init(startpath).then(() => this.startSound.play());
          this.music = new GlobalSoundFacade(this.audioListener, true, MUSIC_VOLUME);
          this.music.init(musicpath).then(() => this.music.play());
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
