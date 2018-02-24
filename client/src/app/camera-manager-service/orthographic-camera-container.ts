import { OrthographicCamera, AudioListener } from "three";
import { CarInfos } from "../render-service/render.service";
import { ICameraContainer } from "./camera-container";
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const INITIAL_CAMERA_POSITION_Y: number = 10;

export class OrthographicCameraContainer extends ICameraContainer {

    public constructor() {
        super();
        this.cam = new OrthographicCamera(
            -this.cameraDistance * this.aspectRatio,
            this.cameraDistance * this.aspectRatio,
            this.cameraDistance,
            -this.cameraDistance,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this.init();
    }

    public update(targetInfos: CarInfos, timelapse: number): void {

    }
    private init(): void {
        this.cam.position.set(
            this.carInfos.position.x,
            INITIAL_CAMERA_POSITION_Y,
            this.carInfos.position.z
        );
        this.cam.lookAt(this.carInfos.position);
    }
}
