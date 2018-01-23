import { Injectable } from "@angular/core";
import { PerspectiveCamera, OrthographicCamera, Vector3, Camera } from "three";
import { DEG_TO_RAD, MS_TO_SECONDS } from "../constants";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_DISTANCE: number = 10;
const PERS_CAMERA_ANGLE: number = 30;
const INITIAL_CAMERA_POSITION_Y: number = 25;
const PERSP_CAMERA_ACCELERATION_FACTOR: number = 5;
const MAX_RECOIL_DISTANCE: number = 8;
const STARTING_ASPECTRATIO: number = 16 / 9;

export enum CameraType {
    Ortho,
    Persp
}

@Injectable()
export class CameraManagerService {

    private persp: PerspectiveCamera;
    private ortho: OrthographicCamera;
    private cameraDistance: number;
    private aspectRatio: number;
    private type: CameraType;
    private carInfos: {position: Vector3, direction: Vector3};
    private thirdPersonPoint: Vector3;
    private effectModeisEnabled: boolean;

    public constructor() {
        this.carInfos = {position: new Vector3(0, 0, 0), direction: new Vector3(0, 0, 0)};
        this.thirdPersonPoint = new Vector3(0, 0, 0);
        this.effectModeisEnabled = false;
        this.aspectRatio = STARTING_ASPECTRATIO;
        this.init();
     }

    public init(): void  {
        this.cameraDistance = INITIAL_CAMERA_DISTANCE;
        this.type = CameraType.Persp;

        this.persp = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.aspectRatio,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        this.ortho = new OrthographicCamera(
            -this.cameraDistance * this.aspectRatio,
            this.cameraDistance * this.aspectRatio,
            this.cameraDistance,
            -this.cameraDistance,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        this.persp.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this.persp.lookAt(this.carInfos.position);
        this.ortho.position.set(
            this.carInfos.position.x,
            INITIAL_CAMERA_POSITION_Y,
            this.carInfos.position.z
        );
        this.ortho.lookAt(this.carInfos.position);
     }

    public updatecarInfos(position: Vector3, direction: Vector3): void {
        this.carInfos.position = position;
        this.carInfos.direction = direction;
     }

    public update(deltaTime: number): void {
        this.thirdPersonPoint.copy(this.calcPosPerspCamera());
        this.updateCameraPostion(deltaTime);
     }

    public get camera(): Camera {
        switch (this.type) {
            case CameraType.Ortho:
            return this.ortho;
            case CameraType.Persp:
            return this.persp;
            default:
            return this.persp;
        }
     }

    public onResize(aspectRation: number): void {
        this.aspectRatio = aspectRation;
        this.persp.aspect = this.aspectRatio;
        this.persp.updateProjectionMatrix();
        this.resizeOrtho();
     }

    public switchCamera(): void {
        if (this.type === CameraType.Ortho) {
            this.type = CameraType.Persp;
        } else if (this.type === CameraType.Persp) {
            this.type = CameraType.Ortho;
        }
     }

    public get cameraType(): CameraType {
        return this.type;
     }

    public set cameraType(type: CameraType) {
        this.type = type;
     }

    public get position(): Vector3 {
        switch (this.type) {
            case CameraType.Ortho:
            return this.ortho.position;
            case CameraType.Persp:
            return this.thirdPersonPoint;
            default:
            return this.thirdPersonPoint;
        }
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

    public get effectModeEnabled(): boolean {
         return this.effectModeisEnabled;
     }

    public set effectModeEnabled(value: boolean) {
        this.effectModeisEnabled = value;
     }

    private updateCameraPostion(deltaTime: number): void {
        switch (this.type) {
        case CameraType.Persp:
            this.perspCameraPhysicUpdate(deltaTime);
            this.persp.lookAt(this.carInfos.position);
            break;
        case CameraType.Ortho:
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

    private resizeOrtho(): void {
        this.ortho.left = -this.cameraDistance * this.aspectRatio;
        this.ortho.right = this.cameraDistance * this.aspectRatio;
        this.ortho.top = this.cameraDistance;
        this.ortho.bottom = -this.cameraDistance;
        this.ortho.updateProjectionMatrix();
     }

    private perspCameraPhysicUpdate(deltaTime: number): void {
        if (this.effectModeisEnabled) {

            deltaTime = deltaTime / MS_TO_SECONDS;
            const deltaPos: Vector3 = this.thirdPersonPoint.clone().sub(this.persp.position);
            deltaPos.multiplyScalar(
                PERSP_CAMERA_ACCELERATION_FACTOR * deltaTime *
                (
                    (deltaPos.length() >= MAX_RECOIL_DISTANCE) ? (deltaPos.length() - MAX_RECOIL_DISTANCE + 1) : 1)
                );
            this.persp.position.add(deltaPos);
        } else { this.persp.position.copy(this.thirdPersonPoint); }
     }
}
