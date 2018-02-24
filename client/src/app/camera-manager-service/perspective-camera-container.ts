import { PerspectiveCamera } from "three";
import { CarInfos } from "../render-service/render.service";
import { ICameraContainer } from "./camera-container";
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_POSITION_Y: number = 10;

export class PerspectiveCameraContainer extends ICameraContainer {

    public constructor( ) {
        super();
        this.cam = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.aspectRatio,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this.init();
    }

    private init(): void {
        this.cam.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this.cam.lookAt(this.carInfos.position);
        this.addAudioListener();
    }

    public update(targetInfos: CarInfos, timelapse: number): void {

    }

}
