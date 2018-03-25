import { Injectable } from "@angular/core";
import { Vector3, Camera, AudioListener } from "three";
import { CameraContainer, ZoomLimit } from "./camera-container";
import { PerspectiveCameraContainer } from "./perspective-camera-container";
import { OrthographicCameraContainer } from "./orthographic-camera-container";
import { CameraType } from "../../global-constants/constants";
import { HoodCamContainer } from "./hood-cam-container";

const INITIAL_CAMERA_DISTANCE: number = 10;

export class TargetInfos {
    public constructor(
        public position: Vector3,
        public direction: Vector3
    ) { }

    public copy(copy: TargetInfos): void {
        this.position = copy.position;
        this.direction = copy.direction;
    }
}

@Injectable()
export class CameraManagerService {

    private _cameraArray: Array<CameraContainer>;
    private _selectedCameraIndex: number;
    private _targetInfos: TargetInfos;
    private _audioListener: AudioListener;

    public constructor() {
        this.initMembers();
        this.initCameraArray();
        this.initAudioListener();
    }

    private initMembers(): void {
        this._targetInfos = new TargetInfos(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
        this._audioListener = new AudioListener();
        this._selectedCameraIndex = 0;
        this._cameraArray = new Array<CameraContainer>();
    }

    private initCameraArray(): void {
        const perspContainer: PerspectiveCameraContainer =
            new PerspectiveCameraContainer(this._audioListener, this._targetInfos, INITIAL_CAMERA_DISTANCE, new ZoomLimit());

        const orthoContainer: OrthographicCameraContainer =
            new OrthographicCameraContainer(this._audioListener, this._targetInfos, INITIAL_CAMERA_DISTANCE, new ZoomLimit());

        const hoodContainer: HoodCamContainer =
            new HoodCamContainer(this._audioListener, this._targetInfos, INITIAL_CAMERA_DISTANCE, new ZoomLimit());
        this._cameraArray.push(hoodContainer);
        this._cameraArray.push(perspContainer);
        this._cameraArray.push(orthoContainer);
    }

    private initAudioListener(): void {
        this._cameraArray[1].addAudioListener();
    }

    public updateTargetInfos(infos: TargetInfos): void {
        this._targetInfos.copy(infos);
    }

    public update(deltaTime: number, ): void {
        this.selectedCamera.update(deltaTime);
    }

    public get camera(): Camera {
        return this.selectedCamera.camera;
    }

    public onResize(aspectRatio: number): void {
        this._cameraArray.forEach((camera) => camera.onResize(aspectRatio));
    }

    private get selectedCamera(): CameraContainer {
        return this._cameraArray[this._selectedCameraIndex];
    }

    public get position(): Vector3 {
        return this.selectedCamera.position();
    }

    public get realPosition(): Vector3 {
        return this.selectedCamera.camera.position;
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
        this.selectedCamera.removeAudioListener();
        this._selectedCameraIndex += 1;
        this._selectedCameraIndex %= this._cameraArray.length;
        this.selectedCamera.addAudioListener();
    }

    public toggleCameraEffect(): void {
        this.selectedCamera.toggleEffectMode();
    }

    public zoomIn(): void {
        this.selectedCamera.zoomIn();
    }

    public zoomOut(): void {
        this.selectedCamera.zoomOut();
    }

    public zoomRelease(): void {
        this.selectedCamera.zoomRelease();
    }

    public set zoomLimit(zoomLimit: ZoomLimit) {
        this._cameraArray.forEach((container: CameraContainer) =>
            container.updateZoomLimit(zoomLimit));
    }

    public get cameraType(): CameraType {
        return this.selectedCamera.type;
    }

    public set cameraType(type: CameraType) {
        this._cameraArray.forEach((container: CameraContainer, index: number) => {
            if (container.type === type) { this._selectedCameraIndex = index; }
        });
    }

    public scrollZoom(deltaZoom: number): void {
        this.selectedCamera.scrollZoom(deltaZoom);
    }
}
