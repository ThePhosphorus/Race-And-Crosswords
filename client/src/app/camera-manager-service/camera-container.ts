import {Camera, Vector3, AudioListener } from "three";

const MINIMAL_ZOOM: number = 4;
const MAXIMAL_ZOOM: number = 25;

export class ZoomLimit {
    public min: number;
    public max: number;

    public constructor(min?: number, max?: number) {
        this.min = (min) ? min : MINIMAL_ZOOM;
        this.max = (max) ? max : MAXIMAL_ZOOM;
    }
}

export abstract class CameraContainer {
    public constructor(
        private _audioListener: AudioListener,
        protected _targetPosition: Vector3,
        protected _TargetDirection: Vector3,
        protected cameraDistance: number,
        protected zoom: number,
        protected zoomLimit: ZoomLimit;
    ) {

    }

    public zoomIn(): void {
        this.zoom = 1;
    }
    public zoomOut(): void {
        this.zoom = -1;
    }
    public addAudioListener(): void {
        this.camera().add(this._audioListener);
    }

    public removeAudioListener(): void {
        this.camera().remove(this._audioListener);
    }

    public abstract camera(): Camera;
    public abstract position(): Vector3;
    public abstract onResize(aspectRatio: number): void;
    public abstract update(deltaTime: number): void;

    protected abstract updateCameraPosition(): void;
}
