import { Camera, OrthographicCamera } from "three";
import { CameraContainerInterface } from "./camera-container-interface";
import { CarInfos } from "../render-service/render.service";
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;

export class OrthographicCameraContainer extends CameraContainerInterface {
    private ortho: Camera;

    public constructor() {
        super();
        this.ortho = new OrthographicCamera(
            -this.cameraDistance * this.aspectRatio,
            this.cameraDistance * this.aspectRatio,
            this.cameraDistance,
            -this.cameraDistance,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
    }

    public get camera(): Camera {
        return this.ortho;
    }

    public update(targetInfos: CarInfos, timelapse: number): void {

    }
}
