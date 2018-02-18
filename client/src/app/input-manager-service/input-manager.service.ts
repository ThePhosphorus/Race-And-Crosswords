import { Injectable } from "@angular/core";

export const CHANGE_CAMERA_KEYCODE: number = 67; // c
export const TOOGLE_CAMERA_EFFECT_MODE: number = 88; // ,
export const ZOOM_IN_KEYCODE: number = 187; // +
export const ZOOM_OUT_KEYCODE: number = 189; // -
export const NIGHT_MODE: number = 78; // n
export const LIGTHS: number = 76; // l

@Injectable()
export class InputManagerService {

    private keyUpBindings: Map<number, Array<(event?: KeyboardEvent) => void>>;
    private keyDownBindings: Map<number, Array<(event?: KeyboardEvent) => void>>;

    public constructor() {
        this.resetBindings();
    }

    public resetBindings(): void {
        this.keyDownBindings = new Map<number, Array<(event?: KeyboardEvent) => void>>();
        this.keyUpBindings = new Map<number, Array<(event?: KeyboardEvent) => void>>();
    }

    public handleKeyDown(event: KeyboardEvent): void {
        this.keyDownBindings.get(event.keyCode).forEach((func) => func(event));
    }

    public handleKeyUp(event: KeyboardEvent): void {
        this.keyUpBindings.get(event.keyCode).forEach((func) => func(event));
    }

    public registerKeyDown(keycode: number, callback: (event?: KeyboardEvent) => void): void {
        if (!this.keyDownBindings.has(keycode)) {
            this.keyDownBindings.set(keycode, new Array<(event?: KeyboardEvent) => void>());
        }
        this.keyDownBindings.get(keycode).push(callback);
    }

    public registerKeyUp(keycode: number, callback: (event?: KeyboardEvent) => void): void {
        if (!this.keyUpBindings.has(keycode)) {
            this.keyUpBindings.set(keycode, new Array<(event?: KeyboardEvent) => void>());
        }
        this.keyUpBindings.get(keycode).push(callback);
    }
}
