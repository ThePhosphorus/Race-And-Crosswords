import { Camera, Vector3, AudioListener} from "three";
import { CarInfos } from "../render-service/render.service";
const STARTING_ASPECTRATIO_WIDTH: number = 16;
const STARTING_ASPECTRATIO_HEIGHT: number = 9;
const STARTING_ASPECTRATIO: number = STARTING_ASPECTRATIO_WIDTH / STARTING_ASPECTRATIO_HEIGHT;

export abstract class ICameraContainer {
    protected cameraDistance: number;
    protected aspectRatio: number;
    protected farClippingPlane: number;
    protected cam: Camera;
    protected carInfos: { position: Vector3, direction: Vector3 };
    protected audioListener: AudioListener;

    public constructor() {
        this.aspectRatio = STARTING_ASPECTRATIO;
    }
    public abstract  update(targetInfos: CarInfos, timelapse: number): void;

    public zoomIn(): void {}
    public zoomOut(): void {}

    public get camera(): Camera {
        return this.cam;
    }

    public addAudioListener(audioListener: AudioListener): void {
        this.cam.add(audioListener);
    }

    public removeAudioListener(): void {
        this.cam.remove(this.audioListener);
    }

}
