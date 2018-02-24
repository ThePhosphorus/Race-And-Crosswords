import { PerspectiveCamera, Vector3, AudioListener, Camera } from "three";
import { CameraContainer } from "./camera-container";
import { DEG_TO_RAD, MS_TO_SECONDS } from "../constants";
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const PERS_CAMERA_ANGLE: number = 25;
const MAX_RECOIL_DISTANCE: number = 8;
const PERSP_CAMERA_ACCELERATION_FACTOR: number = 5;
const SMOOTHING_EFFET_ON_OFFECT_MODE: number = 100;
const INITIAL_CAMERA_POSITION_Y: number = 10;
const INITIAL_RATIO_WIDTH: number = 16;
const INITIAL_RATIO_HEIGHT: number = 9;
const INITIAL_ASPECT_RATIO: number = INITIAL_RATIO_WIDTH / INITIAL_RATIO_HEIGHT;

export class PerspectiveCameraContainer implements CameraContainer {
    private thirdPersonPoint: Vector3;
    private _perspCamera: PerspectiveCamera;
    private effectModeisEnabled: boolean;

    public constructor(audioListener: AudioListener, carInfos: { position: Vector3, direction: Vector3 }) {
        this.aspectRatio = INITIAL_ASPECT_RATIO;
        this.thirdPersonPoint = new Vector3(0, 0, 0);
        this.audioListener = audioListener;
        this.carInfos = carInfos;
        this._camera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.aspectRatio,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this.init();
    }

    private init(): void {
        this._camera.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this._camera.lookAt(this.carInfos.position);
    }

    public update(deltaTime: number, thirdPersonPoint: Vector3, effectModeisEnabled: boolean): void {
        this.thirdPersonPoint.copy(this.calcPosPerspCamera());
        this.perspCameraPhysicUpdate(deltaTime, thirdPersonPoint, effectModeisEnabled);
        this._camera.lookAt(this.carInfos.position);
    }
    public updateCameraPosition(): void {

    }
    public onResize(aspectRatio: number): void {
        this.aspectRatio = aspectRatio;
        this._camera.aspect = this.aspectRatio;
        this._camera.updateProjectionMatrix();
    }

    private calcPosPerspCamera(): Vector3 {
        const carDirection: Vector3 = this.carInfos.direction;
        const projectionXZ: number = Math.cos(PERS_CAMERA_ANGLE * DEG_TO_RAD) * this.cameraDistance;
        carDirection.setY(0);
        carDirection.normalize();

        return new Vector3(
            this.carInfos.position.x + (- carDirection.x * projectionXZ),
            this.carInfos.position.y + (Math.sin(PERS_CAMERA_ANGLE * DEG_TO_RAD) * this.cameraDistance),
            this.carInfos.position.z + (- carDirection.z * projectionXZ)
        );
    }

    private perspCameraPhysicUpdate(deltaTime: number, thirdPersonPoint: Vector3, effectModeisEnabled: boolean): void {
        if (effectModeisEnabled) {

            deltaTime = deltaTime / MS_TO_SECONDS;
            const deltaPos: Vector3 = thirdPersonPoint.clone().sub(this._camera.position);
            deltaPos.multiplyScalar(
                PERSP_CAMERA_ACCELERATION_FACTOR * deltaTime *
                (
                    (deltaPos.length() >= MAX_RECOIL_DISTANCE ) ?
                    (((deltaPos.length() - MAX_RECOIL_DISTANCE) / SMOOTHING_EFFET_ON_OFFECT_MODE)  + 1) : 1)
                );
            this._camera.position.add(deltaPos);
        } else { this._camera.position.copy(thirdPersonPoint); }
    }

    public position(): Vector3 {
        return this.thirdPersonPoint;
    }

    public  camera(): Camera {
        return this._camera;
    }

    public toggleEffect (): void {
        this.effectModeEnabled = !this.effectModeEnabled;
    }

    public get effectModeEnabled(): boolean {
        return this.effectModeisEnabled;
    }

    public set effectModeEnabled(value: boolean) {
        this.effectModeisEnabled = value;
    }
}
