import { Injectable } from "@angular/core";
import { Vector3, Camera, AudioListener } from "three";
import { DEG_TO_RAD, MS_TO_SECONDS } from "../constants";
import { CameraContainer } from "./camera-container";
import { PerspectiveCameraContainer } from "./perspective-camera-container";
import { OrthographicCameraContainer } from "./orthographic-camera-container";

const NB_CAMERAS: number = 2;
const INITIAL_CAMERA_DISTANCE: number = 10;
const PERS_CAMERA_ANGLE: number = 25;
const INITIAL_CAMERA_POSITION_Y: number = 10;
const PERSP_CAMERA_ACCELERATION_FACTOR: number = 5;
const MAX_RECOIL_DISTANCE: number = 8;
const SMOOTHING_EFFET_ON_OFFECT_MODE: number = 100;
const ZOOM_FACTOR: number = 0.5;

export enum CameraType {
    Ortho,
    Persp
}

@Injectable()
export class CameraManagerService {

    private cameras: Array<CameraContainer>;
    private perspContainer: PerspectiveCameraContainer;
    private orthoContainer: OrthographicCameraContainer;
    private cameraDistance: number;
    private cameraIndex: number;
    private thirdPersonPoint: Vector3;

    private type: CameraType;
    private carInfos: { position: Vector3, direction: Vector3 };

    public constructor() {
        this.carInfos = {position: new Vector3(0, 0, 0), direction: new Vector3(0, 0, 0)};
        this.thirdPersonPoint = new Vector3(0, 0, 0);
        this.effectModeisEnabled = false;
        this.audioListener = new AudioListener();
        this.zoomLimit = new ZoomLimit();
        this.init();
     }

     // DONE
    public init(): void {
        this.zoom = 0;
        this.cameraDistance = INITIAL_CAMERA_DISTANCE;
        this.cameraIndex = 0;
        this.type = this.cameraIndex % NB_CAMERAS;
        this.perspContainer = new PerspectiveCameraContainer(this.audioListener, this.carInfos);
        this.orthoContainer = new OrthographicCameraContainer(this.audioListener, this.cameraDistance);
        this.cameras.push(this.perspContainer);
        this.cameras.push(this.orthoContainer);
        this.cameras[this.cameraIndex].addAudioListener();
    }

    public updatecarInfos(position: Vector3, direction: Vector3): void {
        this.carInfos.position = position;
        this.carInfos.direction = direction;
    }
    // TODO
    public update(deltaTime: number, ): void {
        this.cameras.forEach((camera) => {
            camera.update(deltaTime, this.thirdPersonPoint, this.effectModeisEnabled);
        });
        // ORIGINAL>>>
        this.thirdPersonPoint.copy(this.calcPosPerspCamera());
        this.updateCameraPostion(deltaTime);
        // ORIGINAL<<
    }

    // DONE
    public get camera(): Camera {
        return this.cameras[this.type].camera();
    }

    // Done
    public onResize(aspectRatio: number): void {
        this.cameras.forEach((camera) => {
            camera.onResize(aspectRatio);
        });
    }

    public get cameraType(): CameraType {
        return this.type;
    }

    public set cameraType(type: CameraType) {
        this.type = type;
    }

    public scrollZoom(deltaZoom: number): void {
        if ((deltaZoom < 0 && this.cameraDistance > this.zoomLimit.min) ||
         (deltaZoom > 0 && this.cameraDistance < this.zoomLimit.max)) {
            this.cameraDistance += deltaZoom;
        }
    }

    // DONE
    public get position(): Vector3 {
        return this.cameras[this.cameraIndex].position();
    }

    public get realPosition(): Vector3 {
        return this.cameras[this.cameraIndex].camera().position;
    }

    public get cameraDistanceToCar(): number {
        return this.cameraDistance;
    }

    public set cameraDistanceToCar(distance: number) {
        this.cameraDistance = distance;
    }

    public get audioListener(): AudioListener {
        return this.cameras[this.cameraIndex].audioListener;
    }

    // TODO UPDATE POSITION.
    private updateCameraPostion(deltaTime: number): void {
        if ((this.zoom > 0 && this.cameraDistance > this.zoomLimit.min) ||
         (this.zoom < 0 && this.cameraDistance < this.zoomLimit.max)) {
            this.cameraDistance -= this.zoom * ZOOM_FACTOR;
        }
        switch (this.type) {
            case CameraType.Persp:
                this.perspCameraPhysicUpdate(deltaTime);
                this.persp.lookAt(this.carInfos.position);
                break;
            case CameraType.Ortho:
                this.resizeOrtho();
                this.ortho.position.copy(this.carInfos.position);
                this.ortho.position.setY(INITIAL_CAMERA_POSITION_Y);
                break;
            default:
                break;
        }
    }

    // Input manager callbacks
    public switchCamera(): void {
        this.cameras[this.cameraIndex++].removeAudioListener();
        this.cameraIndex %= this.cameras.length - 1;
        this.cameras[this.cameraIndex].addAudioListener();
    }

    public zoomIn (): void {
        this.cameras[this.cameraIndex].zoomIn();
    }

    public zoomOut (): void {
        this.cameras[this.cameraIndex].zoomOut();
    }

    public zoomRelease (): void {
        this.cameras[this.cameraIndex].zoomRelease();
    }
}
