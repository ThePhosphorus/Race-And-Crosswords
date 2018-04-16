import { LoadedObject } from "../race/game-component/loader-service/load-types.enum";

// tslint:disable:no-magic-numbers
// global
export const HALF: number = 0.5;
export const DOUBLE: number = 2;
export const TRIPLE: number = 3;
export const AMBIENT_LIGHT_OPACITY: number = 1.1;
export const AMBIENT_NIGHT_LIGHT_OPACITY: number = 0.3;
export const WHITE: number = 0xFFFFFF;
export const RED: number = 0xFF0000;
export const SUNSET: number = 0xFFEAAA;

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
export const QUARTER: number = 0.25;
export const SHADOWMAP_SIZE: number = 2048;
export const SHADOW_CAMERA_PLANE_RATIO: number = 1 / 30;

export const BACKEND_URL: string = "http://localhost:3000/";

// KEYCODES CONSTANTS
export const ACCELERATE_KEYCODE: number = 87; // w
export const LEFT_KEYCODE: number = 65; // a
export const BRAKE_KEYCODE: number = 83; // s
export const RIGHT_KEYCODE: number = 68; // d
export const CHANGE_CAMERA_KEYCODE: number = 67; // c
export const TOGGLE_CAMERA_EFFECT_MODE: number = 88; // x
export const ZOOM_IN_KEYCODE: number = 187; // +
export const ZOOM_OUT_KEYCODE: number = 189; // -
export const TOGGLE_NIGHT_MODE_KEYCODE: number = 78; // n
export const TOGGLE_SUNLIGHT_KEYCODE: number = 77; // m
export const HANDBRAKE_KEYCODE: number = 32; // spacebar
export const LEFT_CLICK_CODE: number = 0;
export const MIDDLE_CLICK_CODE: number = 1;
export const RIGHT_CLICK_CODE: number = 2;
export const DELETE_KEY: number = 46;

export const NB_LAPS: number = 3;

// Physics constants
export const METER_TO_KM_SPEED_CONVERSION: number = 3.6;

// Timer constants
export const S_TO_MS: number = 1000;
export const MIN_TO_S: number = 60;

export const PLAYER_NAMES: Map<LoadedObject, string> = new Map<LoadedObject, string>([[LoadedObject.carBlue, "Jarvis (Blue)"],
                                                                                      [LoadedObject.carGreen, "Skynet (Green)"],
                                                                                      [LoadedObject.carOrange, "GLaDOS (Orange)"],
                                                                                      [LoadedObject.carPink, "Cortana (Pink)"],
                                                                                      [LoadedObject.carPurple, "K-2SO (Purple)"],
                                                                                      [LoadedObject.carRed, "HAL9000 (Red)"],
                                                                                      [LoadedObject.carYellow, "Viki (Yellow)"]]);
