import { Camera, PerspectiveCamera,  } from "three";
import { CameraContainerInterface } from "./camera-container-interface";
import { CarInfos } from "../render-service/render.service";
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

export class PerspectiveCameraContainer extends CameraContainerInterface {
    private persp: Camera;

    public constructor() {
        super();
        this.persp = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.aspectRatio,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
    }

    public get camera(): Camera {
        return this.persp;
    }

    public update(targetInfos: CarInfos, timelapse: number): void {

    }
}
