
// global
export const HALF: number = 0.5;
export const DOUBLE: number = 2;
export const AMBIENT_LIGHT_OPACITY: number = 0.85;
export const WHITE: number = 0xFFFFFF;

// camera constants
export const FAR_CLIPPING_PLANE: number = 1000;
export const NEAR_CLIPPING_PLANE: number = 1;
export const INITIAL_CAMERA_POSITION_Y: number = 10;
export const INITIAL_RATIO_WIDTH: number = 16;
export const INITIAL_RATIO_HEIGHT: number = 9;
export const INITIAL_ASPECT_RATIO: number = INITIAL_RATIO_WIDTH / INITIAL_RATIO_HEIGHT;
export enum CameraType {
    Perspective,
    Orthographic
 }
