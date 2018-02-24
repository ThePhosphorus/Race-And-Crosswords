import { Injectable } from "@angular/core";
import { Vector3, Camera, AudioListener } from "three";
import { CameraContainer, ZoomLimit } from "./camera-container";
import { PerspectiveCameraContainer } from "./perspective-camera-container";
import { OrthographicCameraContainer } from "./orthographic-camera-container";

const INITIAL_CAMERA_DISTANCE: number = 10;

export class TargetInfos {
    public constructor (
        public position: Vector3,
        public direction: Vector3
    ) {}
}

@Injectable()
export class CameraManagerService {

    private _cameraArray: Array<CameraContainer>;
    private selectedCameraIndex: number;
    private targetInfos: TargetInfos;
    private _audioListener: AudioListener;

    public constructor() {
        this.targetInfos = {position: new Vector3(0, 0, 0), direction: new Vector3(0, 0, 0)};
        this.init();
     }

     // DONE
    public init(): void {
        this.selectedCameraIndex = 0;
        this._cameraArray = new Array<CameraContainer>();
        const perspContainer: PerspectiveCameraContainer =
            new PerspectiveCameraContainer(this._audioListener, this.targetInfos, INITIAL_CAMERA_DISTANCE, new ZoomLimit());
        const orthoContainer: OrthographicCameraContainer =
            new OrthographicCameraContainer(this._audioListener, this.targetInfos, INITIAL_CAMERA_DISTANCE, new ZoomLimit());
        this._cameraArray.push(perspContainer);
        this._cameraArray.push(orthoContainer);
        // this.selectedCamera.addAudioListener();
     }

    public updateTargetInfos(position: Vector3, direction: Vector3): void {
        this.targetInfos.position = position;
        this.targetInfos.direction = direction;
     }

    public update(deltaTime: number, ): void {
        this.selectedCamera.update(deltaTime);
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
        return this._cameraArray[this.selectedCameraIndex];
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

    // Input manager callbacks
    public switchCamera(): void {
        // this.selectedCamera.removeAudioListener();
        this.selectedCameraIndex += 1;
        this.selectedCameraIndex %= this._cameraArray.length;
        // this.selectedCamera.addAudioListener();
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
