import { OrthographicCamera, Vector3, AudioListener, Camera } from "three";
import { CameraContainer, ZoomLimit } from "./camera-container";
import { TargetInfos } from "./camera-manager.service";
import {
    CameraType,
    FAR_CLIPPING_PLANE,
    NEAR_CLIPPING_PLANE,
    INITIAL_CAMERA_POSITION_Y,
    INITIAL_ASPECT_RATIO
} from "../../global-constants/constants";

export class OrthographicCameraContainer extends CameraContainer {
    private _orthoCamera: OrthographicCamera;
    private _aspectRatio: number;

    public constructor(audioListener: AudioListener, targetInfos: TargetInfos, cameraDistance: number, zoomLimit: ZoomLimit) {
        super(audioListener, targetInfos, cameraDistance, zoomLimit, CameraType.Orthographic);
        this._aspectRatio = INITIAL_ASPECT_RATIO;
        this._orthoCamera = new OrthographicCamera(
            -cameraDistance * this._aspectRatio,
            cameraDistance * this._aspectRatio,
            cameraDistance,
            -cameraDistance,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this.init();
    }

    private init(): void {
        this._orthoCamera.position.set(
            this._targetInfos.position.x,
            INITIAL_CAMERA_POSITION_Y,
            this._targetInfos.position.z
        );
        this._orthoCamera.lookAt(this._targetInfos.position);
    }
    public fixUpdate(): void {
        this.onResize();
        this._orthoCamera.position.copy(this._targetInfos.position);
        this._orthoCamera.position.setY(INITIAL_CAMERA_POSITION_Y);
    }

    public removeAudioListener(): void {
        this._orthoCamera.remove(this.audioListener);
    }

    public onResize(aspectRatio?: number): void {
        if (aspectRatio) {
            this._aspectRatio = aspectRatio;
        }
        this._orthoCamera.left = -this.cameraDistance * this._aspectRatio;
        this._orthoCamera.right = this.cameraDistance * this._aspectRatio;
        this._orthoCamera.top = this.cameraDistance;
        this._orthoCamera.bottom = -this.cameraDistance;
        this._orthoCamera.updateProjectionMatrix();
    }
    public get camera(): Camera {
        return this._orthoCamera;
    }

    public position(): Vector3 {
        return this._orthoCamera.position;
    }
}
