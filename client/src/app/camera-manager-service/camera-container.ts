import {Camera, Vector3 } from "three";

export interface ICameraContainer {
    zoomIn(): void;
    zoomOut(): void;
    addAudioListener(): void;
    removeAudioListener(): void;
    camera(): Camera;
    updateCameraPosition(): void;
    position(): Vector3;
    onResize(aspectRatio: number): void;
    update(deltaTime: number, thirdPersonPoint?: Vector3, effectModeisEnabled?: boolean): void;
}
