import { OrthographicCamera, Vector3, AudioListener, Camera } from "three";
import { ICameraContainer } from "./camera-container";
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const INITIAL_CAMERA_POSITION_Y: number = 10;

export class OrthographicCameraContainer implements ICameraContainer {
    private _camera: OrthographicCamera;
    private audioListener: AudioListener;
    private aspectRatio: number;
    private carInfos: { position: Vector3, direction: Vector3 };
    public constructor(audioListener: AudioListener, cameraDistance: number) {
        this.audioListener = audioListener;
        this._camera = new OrthographicCamera(
            -cameraDistance * this.aspectRatio,
            cameraDistance * this.aspectRatio,
            cameraDistance,
            -cameraDistance,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this.init();
    }

    private init(): void {
        this._camera.position.set(
            this.carInfos.position.x,
            INITIAL_CAMERA_POSITION_Y,
            this.carInfos.position.z
        );
        this._camera.lookAt(this.carInfos.position);
    }
    public update(): void {

    }
    public updateCameraPosition(): void {

    }
    public zoomIn(): void {
        
    }
    public zoomOut(): void {

    }
    public addAudioListener(): void {
        this._camera.add(this.audioListener);
    }
    public removeAudioListener(): void {
        this._camera.remove(this.audioListener);
    }
    public onResize(aspectRatio: number, cameraDistance?: number): void {
        this.aspectRatio = aspectRatio;
        this._camera.left = -cameraDistance * this.aspectRatio;
        this._camera.right = cameraDistance * this.aspectRatio;
        this._camera.top = cameraDistance;
        this._camera.bottom = -cameraDistance;
        this._camera.updateProjectionMatrix();
    }
    public camera(): Camera {
        return this._camera;
    }
    public position(): Vector3 {
        return this._camera.position;
    }
}
