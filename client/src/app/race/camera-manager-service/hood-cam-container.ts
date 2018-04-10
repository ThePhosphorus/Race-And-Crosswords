import { PerspectiveCamera, Vector3, AudioListener, Camera } from "three";
import { CameraContainer, ZoomLimit } from "./camera-container";
import { TargetInfos } from "./camera-manager.service";
import {
    CameraType,
    FAR_CLIPPING_PLANE,
    NEAR_CLIPPING_PLANE,
    INITIAL_CAMERA_POSITION_Y,
    INITIAL_ASPECT_RATIO,
} from "../../global-constants/constants";

const FIELD_OF_VIEW: number = 70;
const CAMERA_TARGET_FACTOR: number = 10;
const TARGET_HEIGHT: number = 1;
const DIRECTION_FACTOR: number = 0.3;
const CAMERA_HEIGHT: number = 1.4;
export class HoodCamContainer extends CameraContainer {
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
        this._perspCamera.lookAt(this._targetInfos.position.clone()
        .add(new Vector3(0, TARGET_HEIGHT, 0)
        .add(
            this._targetInfos.direction.multiplyScalar(CAMERA_TARGET_FACTOR)
        )));
    }

    public onResize(aspectRatio: number): void {
        this._perspCamera.aspect = aspectRatio;
        this._perspCamera.updateProjectionMatrix();
    }

    private calcPosPerspCamera(): Vector3 {
        const carDirection: Vector3 = this._targetInfos.direction;
        carDirection.setY(0);
        carDirection.normalize();

        return new Vector3(
            this._targetInfos.position.x + (carDirection.x * DIRECTION_FACTOR ),
            this._targetInfos.position.y + CAMERA_HEIGHT,
            this._targetInfos.position.z + (carDirection.z * DIRECTION_FACTOR)
        );
    }

    public position(): Vector3 {
        return this._perspCamera.position;
    }

    public get camera(): Camera {
        return this._perspCamera;
    }
}
