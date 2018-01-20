import { Injectable } from "@angular/core";
import { PerspectiveCamera, OrthographicCamera, Vector3, Camera } from "three";
import { DEG_TO_RAD } from "../constants";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_DISTANCE: number = 20;
const PERS_CAMERA_ANGLE: number = 10;
const INITIAL_CAMERA_POSITION_Y: number = 25;

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

    public constructor() {
        this.carInfos = {position: new Vector3(), direction: new Vector3()};
        this.thirdPersonPoint = new Vector3();
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

    public update(): void {
        this.ortho.position.copy(this.carInfos.position);
        this.ortho.position.setY(INITIAL_CAMERA_POSITION_Y);
        this.thirdPersonPoint.copy(this.calcPosPerspCamera());
        this.persp.position.copy(this.thirdPersonPoint); // TODO : add wobble effect
        this.persp.lookAt(this.carInfos.position);
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

    private calcPosPerspCamera(): Vector3 {
        const carPos: Vector3 = this.carInfos.position;
        const carDirection: Vector3 = this.carInfos.direction;
        const projectionXZ: number = Math.cos(PERS_CAMERA_ANGLE * DEG_TO_RAD) * this.cameraDistance;
        carDirection.setY(0);
        carDirection.normalize();

        return new Vector3(
            carPos.x + (- carDirection.x * projectionXZ),
            carPos.y + (Math.sin(PERS_CAMERA_ANGLE * DEG_TO_RAD) * this.cameraDistance),
            carPos.z + (- carDirection.z * projectionXZ)
        );
     }

    private resizeOrtho(): void {
        this.ortho.left = -this.cameraDistance * this.aspectRatio;
        this.ortho.right = this.cameraDistance * this.aspectRatio;
        this.ortho.top = this.cameraDistance;
        this.ortho.bottom = -this.cameraDistance;
        this.ortho.updateProjectionMatrix();
     }

}
