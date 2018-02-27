import { PerspectiveCamera, Vector3, AudioListener, Camera } from "three";
import { CameraContainer, ZoomLimit } from "./camera-container";
import { TargetInfos } from "./camera-manager.service";
import {
    CameraType,
    FAR_CLIPPING_PLANE,
    NEAR_CLIPPING_PLANE,
    INITIAL_CAMERA_POSITION_Y,
    INITIAL_ASPECT_RATIO,
    DEG_TO_RAD,
    MS_TO_SECONDS
} from "../../global-constants/constants";

const FIELD_OF_VIEW: number = 70;
export const PERS_CAMERA_ANGLE: number = 25;
const MAX_RECOIL_DISTANCE: number = 8;
const PERSP_CAMERA_ACCELERATION_FACTOR: number = 5;
const SMOOTHING_EFFET_ON_OFFECT_MODE: number = 100;

export class PerspectiveCameraContainer extends CameraContainer {
    private thirdPersonPoint: Vector3;
    private _perspCamera: PerspectiveCamera;
    private effectModeisEnabled: boolean;

    public constructor(audioListener: AudioListener, targetInfos: TargetInfos, cameraDistance: number, zoomLimit: ZoomLimit) {
        super(audioListener, targetInfos, cameraDistance, zoomLimit, CameraType.Perspective);
        this.thirdPersonPoint = new Vector3(0, 0, 0);
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
        this.thirdPersonPoint.copy(this.calcPosPerspCamera());
        this.perspCameraPhysicUpdate(deltaTime);
        this._perspCamera.lookAt(this._targetInfos.position);
    }

    public onResize(aspectRatio: number): void {
        this._perspCamera.aspect = aspectRatio;
        this._perspCamera.updateProjectionMatrix();
    }

    private calcPosPerspCamera(): Vector3 {
        const carDirection: Vector3 = this._targetInfos.direction;
        const projectionXZ: number = Math.cos(PERS_CAMERA_ANGLE * DEG_TO_RAD) * this.cameraDistance;
        carDirection.setY(0);
        carDirection.normalize();

        return new Vector3(
            this._targetInfos.position.x + (- carDirection.x * projectionXZ),
            this._targetInfos.position.y + (Math.sin(PERS_CAMERA_ANGLE * DEG_TO_RAD) * this.cameraDistance),
            this._targetInfos.position.z + (- carDirection.z * projectionXZ)
        );
    }

    private perspCameraPhysicUpdate(deltaTime: number): void {
        if (this.effectModeisEnabled) {

            deltaTime = deltaTime / MS_TO_SECONDS;
            const deltaPos: Vector3 = this.thirdPersonPoint.clone().sub(this._perspCamera.position);
            deltaPos.multiplyScalar(
                PERSP_CAMERA_ACCELERATION_FACTOR * deltaTime *
                (
                    (deltaPos.length() >= MAX_RECOIL_DISTANCE) ?
                        (((deltaPos.length() - MAX_RECOIL_DISTANCE) / SMOOTHING_EFFET_ON_OFFECT_MODE) + 1) : 1)
            );
            this._perspCamera.position.add(deltaPos);
        } else { this._perspCamera.position.copy(this.thirdPersonPoint); }
    }

    public position(): Vector3 {
        return this.thirdPersonPoint;
    }

    public get camera(): Camera {
        return this._perspCamera;
    }

    public toggleEffect(): void {
        this.effectModeEnabled = !this.effectModeEnabled;
    }

    public get effectModeEnabled(): boolean {
        return this.effectModeisEnabled;
    }

    public set effectModeEnabled(value: boolean) {
        this.effectModeisEnabled = value;
    }
}
