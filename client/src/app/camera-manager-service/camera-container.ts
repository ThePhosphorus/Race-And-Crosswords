import {Camera, Vector3, AudioListener } from "three";
import { TargetInfos } from "./camera-manager.service";

const MINIMAL_ZOOM: number = 4;
const MAXIMAL_ZOOM: number = 25;
const ZOOM_FACTOR: number = 0.5;

export class ZoomLimit {
    public min: number;
    public max: number;

    public constructor(min?: number, max?: number) {
        this.min = (min) ? min : MINIMAL_ZOOM;
        this.max = (max) ? max : MAXIMAL_ZOOM;
     }
 }

export abstract class CameraContainer {
    protected zoom: number;

    public constructor(
        private _audioListener: AudioListener,
        protected _targetInfos: TargetInfos,
        protected cameraDistance: number,
        protected zoomLimit: ZoomLimit
    ) {

     }

    public zoomIn(): void {
        this.zoom = 1;
     }

    public zoomOut(): void {
        this.zoom = -1;
     }

    public zoomRelease (): void {
        this.zoom = 0;
     }

    public addAudioListener(): void {
        this.camera().add(this._audioListener);
     }

    public removeAudioListener(): void {
        this.camera().remove(this._audioListener);
     }

    public get audioListener(): AudioListener {
        return this._audioListener;
     }

    public get cameraDistanceToCar(): number {
        return this.cameraDistance;
     }

    public set cameraDistanceToCar(distance: number) {
        this.cameraDistance = distance;
     }

    public checkZoom(): boolean {
        return (this.zoom > 0 && this.cameraDistance > this.zoomLimit.min) ||
        (this.zoom < 0 && this.cameraDistance < this.zoomLimit.max);
     }

    public update(deltaTime: number): void {
        if (this.checkZoom) {
            this.cameraDistance -= this.zoom * ZOOM_FACTOR;
        }

        this.fixUpdate(deltaTime);
     }

    public abstract camera(): Camera;
    public abstract position(): Vector3;
    public abstract onResize(aspectRatio: number): void;
    protected abstract fixUpdate(deltaTime: number): void;
 }
