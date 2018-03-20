import { PerspectiveCamera, Vector3, AudioListener, Camera } from "three";
import { CameraContainer, ZoomLimit } from "./camera-container";
import { TargetInfos } from "./camera-manager.service";
import { PERS_CAMERA_ANGLE } from "../race.constants";
import {
    CameraType,
    FAR_CLIPPING_PLANE,
    NEAR_CLIPPING_PLANE,
    INITIAL_CAMERA_POSITION_Y,
    INITIAL_ASPECT_RATIO,
    DEG_TO_RAD
} from "../../global-constants/constants";

const FIELD_OF_VIEW: number = 70;

export class HoodCamContainer extends CameraContainer {
    private thirdPersonPoint: Vector3;
    private _perspCamera: PerspectiveCamera;

    public constructor(audioListener: AudioListener, targetInfos: TargetInfos, cameraDistance: number, zoomLimit: ZoomLimit) {
        super(audioListener, targetInfos, cameraDistance, zoomLimit, CameraType.Perspective);
        this._perspCamera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            INITIAL_ASPECT_RATIO,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this.init();
    }

    private init(): void {
        this._perspCamera.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this._perspCamera.lookAt(this._targetInfos.position);
    }

    public fixUpdate(deltaTime: number): void {
        this._perspCamera.position.copy(this.calcPosPerspCamera());
        console.log(this._targetInfos.direction.clone().add(this._targetInfos.position));
        this._perspCamera.lookAt(this._targetInfos.direction.clone().add(this._targetInfos.position).add(new Vector3(0, 1, 0)));
    }

    public onResize(aspectRatio: number): void {
        this._perspCamera.aspect = aspectRatio;
        this._perspCamera.updateProjectionMatrix();
    }

    private calcPosPerspCamera(): Vector3 {
        const carDirection: Vector3 = this._targetInfos.direction;
        carDirection.setY(0);
        // carDirection.normalize();

        return new Vector3(
            this._targetInfos.position.x + (carDirection.x ),
            this._targetInfos.position.y + 1,
            this._targetInfos.position.z + (carDirection.z)
        );
    }

    public position(): Vector3 {
        return this.thirdPersonPoint;
    }

    public get camera(): Camera {
        return this._perspCamera;
    }

    public toggleEffectMode(): void {
        return;
    }
}
