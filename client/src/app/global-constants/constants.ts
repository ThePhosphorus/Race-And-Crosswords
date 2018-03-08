// tslint:disable:no-magic-numbers
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

export const STRAIGHT_ANGLE_DEG: number = 180;
export const DEG_TO_RAD: number = Math.PI / STRAIGHT_ANGLE_DEG;
export const MIN_TO_SEC: number = 60;
export const MS_TO_SECONDS: number = 1000;
export const GRAVITY: number = -9.81;
export const RAD_TO_DEG: number = STRAIGHT_ANGLE_DEG / Math.PI;
export const PI_OVER_2: number = Math.PI / 2;

export const BACKEND_URL: string = "http://localhost:3000/";

// timer constants
export const CENTISECOND: number = 10;
export const TWO_SECONDS: number = 2000;

// physics constants
export const METER_TO_KM_SPEED_CONVERSION: number = 3.6;
