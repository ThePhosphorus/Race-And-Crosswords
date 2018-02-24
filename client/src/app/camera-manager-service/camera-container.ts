import { Camera, Vector3, AudioListener } from "three";
import { CarInfos } from "../render-service/render.service";

export interface ICameraContainer {
    cameraDistance: number;
    aspectRatio: number;
    farClippingPlane: number;
    carInfos: { position: Vector3, direction: Vector3 };
    audioListener: AudioListener;

    update(targetInfos: CarInfos, timelapse: number): void;
    zoomIn(): void;
    zoomOut(): void;
    addAudioListener(audioListener: AudioListener): void;
    removeAudioListener(): void;
    resize(aspectRatio: number): void;
}
