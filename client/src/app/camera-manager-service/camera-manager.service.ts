import { Injectable } from "@angular/core";
import { Vector3, Camera, AudioListener } from "three";
import { CameraContainer } from "./camera-container";
import { PerspectiveCameraContainer } from "./perspective-camera-container";
import { OrthographicCameraContainer } from "./orthographic-camera-container";

// const NB_CAMERAS: number = 2;
const INITIAL_CAMERA_DISTANCE: number = 10;
// const PERS_CAMERA_ANGLE: number = 25;
const INITIAL_CAMERA_POSITION_Y: number = 10;
// const PERSP_CAMERA_ACCELERATION_FACTOR: number = 5;
// const MAX_RECOIL_DISTANCE: number = 8;
// const SMOOTHING_EFFET_ON_OFFECT_MODE: number = 100;
const ZOOM_FACTOR: number = 0.5;

export class TargetInfos {
    public constructor (
        public position: Vector3,
        public direction: Vector3
    ) {}
}

@Injectable()
export class CameraManagerService {

    private _cameraArray: Array<CameraContainer>;
    // private perspContainer: PerspectiveCameraContainer;
    // private orthoContainer: OrthographicCameraContainer;
    // private cameraDistance: number;
    private selectedCameraIndex: number;
    private targetInfos: TargetInfos;

    public constructor() {
        this.targetInfos = {position: new Vector3(0, 0, 0), direction: new Vector3(0, 0, 0)};
        // this.thirdPersonPoint = new Vector3(0, 0, 0);
        // this.effectModeisEnabled = false;
        // this.audioListener = new AudioListener()
        // this.zoomLimit = new ZoomLimit();
        this.init();
     }

     // DONE
    public init(): void {
        // this.zoom = 0;
        this.selectedCameraIndex = 0;
        // this.type = this.cameraIndex % NB_CAMERAS;
        const perspContainer: PerspectiveCameraContainer = new PerspectiveCameraContainer(this.audioListener, this.targetInfos); // TODO
        const orthoContainer: OrthographicCameraContainer = new OrthographicCameraContainer(this.audioListener, this.cameraDistance); // TODO
        this._cameraArray.push(perspContainer);
        this._cameraArray.push(orthoContainer);
        this.selectedCamera.addAudioListener();
    }

    public updatecarInfos(position: Vector3, direction: Vector3): void {
        this.targetInfos.position = position;
        this.targetInfos.direction = direction;
    }
    // TODO
    public update(deltaTime: number, ): void {
        this.selectedCamera.update(deltaTime);
        // ORIGINAL>>>
        // this.thirdPersonPoint.copy(this.calcPosPerspCamera());
        // this.updateCameraPostion(deltaTime);
        // ORIGINAL<<
    }

    public get camera(): Camera {
        return this.selectedCamera.camera();
    }

    public onResize(aspectRatio: number): void {
        this._cameraArray.forEach((camera) => {
            camera.onResize(aspectRatio);
        });
    }

    // public scrollZoom(deltaZoom: number): void {
    //     if ((deltaZoom < 0 && this.cameraDistance > this.zoomLimit.min) ||
    //      (deltaZoom > 0 && this.cameraDistance < this.zoomLimit.max)) {
    //         this.cameraDistance += deltaZoom;
    //     }
    // } // TODO

    private get selectedCamera(): CameraContainer {
        return this.selectedCamera;
     }

    public get position(): Vector3 {
        return this.selectedCamera.position();
     }

    public get realPosition(): Vector3 {
        return this.selectedCamera.camera().position;
     }

    public get cameraDistanceToCar(): number {
        return this.selectedCamera.cameraDistanceToCar;
     }

    public set cameraDistanceToCar(distance: number) {
        this.selectedCamera.cameraDistanceToCar = distance;
     }

    public get audioListener(): AudioListener {
        return this.selectedCamera.audioListener;
     }

    // TODO UPDATE POSITION.
    // private updateCameraPostion(deltaTime: number): void {
    //     if (this.selectedCamera.checkZoom) { // TODO: Put this in the persp camera
    //         this.cameraDistance -= this.zoom * ZOOM_FACTOR;
    //     }
    //     switch (this.type) {
    //         case CameraType.Persp:
    //             this.perspCameraPhysicUpdate(deltaTime);
    //             this.persp.lookAt(this.targetInfos.position);
    //             break;
    //     case CameraType.Ortho:
    //             this.resizeOrtho();
    //             this.ortho.position.copy(this.targetInfos.position);
    //             this.ortho.position.setY(INITIAL_CAMERA_POSITION_Y);
    //             break;
    //         default:
    //     break;
    //     }
    // }

    // Input manager callbacks
    public switchCamera(): void {
        this.selectedCamera.removeAudioListener();
        this.selectedCameraIndex++;
        this.selectedCameraIndex %= this._cameraArray.length - 1;
        this.selectedCamera.addAudioListener();
    }

    public zoomIn (): void {
        this.selectedCamera.zoomIn();
    }

    public zoomOut (): void {
        this.selectedCamera.zoomOut();
    }

    public zoomRelease (): void {
        this.selectedCamera.zoomRelease();
    }
}
