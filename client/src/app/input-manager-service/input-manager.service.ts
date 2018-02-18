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

    private keyUpBindings: Map<number, Array<(event?: KeyboardEvent) => {}>>;
    private keyDownBindings: Map<number, Array<(event?: KeyboardEvent) => {}>>;

    public constructor() {
        this.resetBindings();
    }

    public resetBindings(): void {
        this.keyDownBindings = new Map<number, Array<(event?: KeyboardEvent) => {}>>();
        this.keyUpBindings = new Map<number, Array<(event?: KeyboardEvent) => {}>>();
    }

    public handleKeyDown(event: KeyboardEvent): void {
        this.keyDownBindings.forEach((codeBindings) => {
            codeBindings.forEach((func) => func(event));
        });
    }

    public handleKeyUp(event: KeyboardEvent): void {
        this.keyUpBindings.forEach((codeBindings) => {
            codeBindings.forEach((func) => func(event));
        });
    }

    public registerKeyUp(keycode: number, callback: (event?: KeyboardEvent) => {}): void {
        if (!this.keyUpBindings.has(keycode)) {
            this.keyUpBindings.set(keycode, new Array<(event?: KeyboardEvent) => {}>());
        }
        this.keyUpBindings.get(keycode).push(callback);
    }

    public resgisterKeyDown(keycode: number, callback: (event?: KeyboardEvent) => {}): void {
        if (!this.keyDownBindings.has(keycode)) {
            this.keyDownBindings.set(keycode, new Array<(event?: KeyboardEvent) => {}>());
        }
        this.keyDownBindings.get(keycode).push(callback);
    }

}
