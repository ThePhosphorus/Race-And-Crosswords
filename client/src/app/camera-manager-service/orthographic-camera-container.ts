import { OrthographicCamera, Vector3 } from "three";
import { CarInfos } from "../render-service/render.service";
import { ICameraContainer } from "./camera-container";
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const INITIAL_CAMERA_POSITION_Y: number = 10;

export class OrthographicCameraContainer implements ICameraContainer {
    private _camera: OrthographicCamera;
    public constructor() {
        this._camera = new OrthographicCamera(
            -this.cameraDistance * this.aspectRatio,
            this.cameraDistance * this.aspectRatio,
            this.cameraDistance,
            -this.cameraDistance,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this.init();
    }

    public update(targetInfos: CarInfos, timelapse: number): void {

    }
    private init(): void {
        this._camera.position.set(
            this.carInfos.position.x,
            INITIAL_CAMERA_POSITION_Y,
            this.carInfos.position.z
        );
        this._camera.lookAt(this.carInfos.position);
    }
    public zoomIn(): void {
        
    }
    public zoomOut(): void {
        
    }
    public addAudioListener(): void {
        
    }
    
    public removeAudioListener(): void {
        
    }
    public resize(aspectRatio: number): void{
        
    }
    public get camera(): OrthographicCamera {
        return this._camera;
    }
    public get position(): Vector3 {
        return this._camera.position;
    }
}
