import {AbstractSoundContainer, DEFAULT_VOLUME} from "./abstract-sound-container";
import { AudioBuffer} from "three";

const FILE_NAME: string = "idle.ogg";
const MAX_RPM: number = 5500;
const MIN_RPM: number = 800;
export class EngineSound extends AbstractSoundContainer {

    protected setSoundSettings(buffer: AudioBuffer): void {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(DEFAULT_VOLUME);
        this.sound.play();
    }
    protected getFileName(): string {
        return FILE_NAME;
    }

    public updateRPM(rpm: number): void {
        this.sound.setPlaybackRate(this.getPlaybackRate(rpm));
    }

    private getPlaybackRate(rpm: number): number {
        return (rpm - MIN_RPM) / (MAX_RPM - MIN_RPM) + 2; // Augmentation lineaire de la vitesse de lecture (entre 1 et 2)
    }
}
