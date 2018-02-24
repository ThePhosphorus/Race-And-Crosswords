import { Injectable } from "@angular/core";
import { Vector3, Camera, AudioListener } from "three";
import { DEG_TO_RAD, MS_TO_SECONDS } from "../constants";
import { ICameraContainer } from "./camera-container";
import { PerspectiveCameraContainer } from "./perspective-camera-container";
import { OrthographicCameraContainer } from "./orthographic-camera-container";

const NB_CAMERAS: number = 2;
const INITIAL_CAMERA_DISTANCE: number = 10;
const PERS_CAMERA_ANGLE: number = 25;
const INITIAL_CAMERA_POSITION_Y: number = 10;
const PERSP_CAMERA_ACCELERATION_FACTOR: number = 5;
const MAX_RECOIL_DISTANCE: number = 8;
const SMOOTHING_EFFET_ON_OFFECT_MODE: number = 100;
const MINIMAL_ZOOM: number = 4;
const MAXIMAL_ZOOM: number = 25;
const ZOOM_FACTOR: number = 0.5;

export enum CameraType {
    Ortho,
    Persp
}

export class ZoomLimit {
    public min: number;
    public max: number;

    public constructor(min?: number, max?: number) {
        this.min = (min) ? min : MINIMAL_ZOOM;
        this.max = (max) ? max : MAXIMAL_ZOOM;
    }
}

@Injectable()
export class CameraManagerService {

    private cameras: Array<ICameraContainer>;
    private perspContainer: PerspectiveCameraContainer;
    private orthoContainer: OrthographicCameraContainer;
    private cameraDistance: number;
    private cameraIndex: number;
    private thirdPersonPoint: Vector3;
    private zoom: number;
    private type: CameraType;
    public zoomLimit: ZoomLimit;
    private aspectRatio: number;
    private carInfos: { position: Vector3, direction: Vector3 };
    private effectModeisEnabled: boolean;
    private audioListener: AudioListener;

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
        this.cameras[this.cameraIndex].addAudioListener(this.audioListener);
    }

    public updatecarInfos(position: Vector3, direction: Vector3): void {
        this.carInfos.position = position;
        this.carInfos.direction = direction;
    }
    // TODO
    public update(deltaTime: number, ): void {
        this.cameras.forEach((camera) => {
            camera.update(deltaTime, this.thirdPersonPoint, this.effectModeisEnabled)
        });
        this.thirdPersonPoint.copy(this.calcPosPerspCamera());
        this.updateCameraPostion(deltaTime);
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
        return this.cameras[this.type].position();
    }

    public get realPosition(): Vector3 {
        return this.camera.position;
    }

    public get cameraDistanceToCar(): number {
        return this.cameraDistance;
    }

    public set cameraDistanceToCar(distance: number) {
        this.cameraDistance = distance;
    }

    public get listener(): AudioListener {
        return this.audioListener;
    }

    public get effectModeEnabled(): boolean {
        return this.effectModeisEnabled;
    }

    public set effectModeEnabled(value: boolean) {
        this.effectModeisEnabled = value;
    }

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

    private perspCameraPhysicUpdate(deltaTime: number): void {
        if (this.effectModeisEnabled) {

            deltaTime = deltaTime / MS_TO_SECONDS;
            const deltaPos: Vector3 = this.thirdPersonPoint.clone().sub(this.persp.position);
            deltaPos.multiplyScalar(
                PERSP_CAMERA_ACCELERATION_FACTOR * deltaTime *
                (
                    (deltaPos.length() >= MAX_RECOIL_DISTANCE ) ?
                    (((deltaPos.length() - MAX_RECOIL_DISTANCE) / SMOOTHING_EFFET_ON_OFFECT_MODE)  + 1) : 1)
                );
            this.persp.position.add(deltaPos);
        } else { this.persp.position.copy(this.thirdPersonPoint); }
    }

    // Input manager callbacks
    public switchCamera(): void {
        if (this.type === CameraType.Ortho) {
            this.type = CameraType.Persp;
            this.persp.add(this.audioListener);
            this.ortho.remove(this.audioListener);
        } else if (this.type === CameraType.Persp) {
            this.type = CameraType.Ortho;
            this.ortho.add(this.audioListener);
            this.persp.remove(this.audioListener);
        }
    }

    public toggleEffect (): void {
        this.effectModeEnabled = !this.effectModeEnabled;
    }

    public zoomIn (): void {
        this.zoom = 1;
    }

    public zoomOut (): void {
        this.zoom = -1;
    }

    public zoomRelease (): void {
        this.zoom = 0;
    }
}
