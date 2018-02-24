import { PerspectiveCamera, Vector3 } from "three";
import { CarInfos } from "../render-service/render.service";
import { ICameraContainer } from "./camera-container";
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_POSITION_Y: number = 10;

export class PerspectiveCameraContainer implements ICameraContainer {
    private thirdPersonPoint: Vector3;
    public constructor( ) {
        super();
        this._camera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.aspectRatio,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this.init();
        this.thirdPersonPoint = new Vector3(0, 0, 0);
    }

    private init(): void {
        this._camera.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this._camera.lookAt(this.carInfos.position);
    }

    public update(targetInfos: CarInfos, timelapse: number): void {

    }

    public get position(): Vector3 {
        return this.thirdPersonPoint;
    }

    public resize(aspectRatio: number): void {
        this._camera.aspect = this.aspectRatio;
        this._camera.updateProjectionMatrix();
    }

    private updateProjectionMatrix(): void{

    }
}
