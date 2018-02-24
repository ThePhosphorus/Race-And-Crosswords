import { PerspectiveCamera, Vector3 } from "three";
import { CarInfos } from "../render-service/render.service";
import { ICameraContainer } from "./camera-container";
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_POSITION_Y: number = 10;

export class PerspectiveCameraContainer extends ICameraContainer {
    private thirdPersonPoint: Vector3;
    public constructor( ) {
        super();
        this.cam = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.aspectRatio,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this.init();
        this.thirdPersonPoint = new Vector3(0, 0, 0);
    }

    private init(): void {
        this.cam.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this.cam.lookAt(this.carInfos.position);
    }

    public update(targetInfos: CarInfos, timelapse: number): void {

    }

    public get position(): Vector3 {
        return this.thirdPersonPoint;
    }

    public resize(aspectRatio: number): void {
        this.cam.aspect = this.aspectRatio;
        this.cam.updateProjectionMatrix();
    }

    private updateProjectionMatrix(): void{

    }
}
