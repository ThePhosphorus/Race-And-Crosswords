import { Camera } from "three";
import { CarInfos } from "../render-service/render.service";
import { CameraType } from "./camera-manager.service";
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
export abstract class CameraContainerInterface {
    protected cameraDistance: number;
    protected aspectRatio: number;
    private type: CameraType;

    public abstract  get camera(): Camera;
    public abstract  update(targetInfos: CarInfos, timelapse: number): void;

    public constructor() {
    }
    public zoomIn(): void {
    }
    public zoomOut(): void{

    }

}