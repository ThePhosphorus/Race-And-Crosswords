import { Injectable } from "@angular/core";

export const ACCELERATE_KEYCODE: number = 87; // w
export const LEFT_KEYCODE: number = 65; // a
export const BRAKE_KEYCODE: number = 83; // s
export const RIGHT_KEYCODE: number = 68; // d
export const CHANGE_CAMERA_KEYCODE: number = 67; // c
export const TOOGLE_CAMERA_EFFECT_MODE: number = 88; // ,
export const ZOOM_IN_KEYCODE: number = 187; // +
export const ZOOM_OUT_KEYCODE: number = 189; // -
export const NIGHT_MODE: number = 78; // n
export const LIGTHS: number = 76; // l

@Injectable()
export class InputManagerService {

    public constructor() {}

    public handleKeyDown(event: KeyboardEvent): void {
        console.log("DOWN");
    }

    public handleKeyUp(event: KeyboardEvent): void {
        console.log("UP");
    }

}
