import { Injectable } from "@angular/core";

@Injectable()
export class InputManagerService {

    private _keyUpBindings: Map<number, Array<() => void>>;
    private _keyDownBindings: Map<number, Array<() => void>>;

    public constructor() {
        this.resetBindings();
    }

    public resetBindings(): void {
        this._keyDownBindings = new Map<number, Array<() => void>>();
        this._keyUpBindings = new Map<number, Array<() => void>>();
    }

    public handleKeyDown(event: KeyboardEvent): void {
        if (this._keyDownBindings.get(event.keyCode) != null) {
            this._keyDownBindings.get(event.keyCode).forEach((func) => func());
        }
    }

    public handleKeyUp(event: KeyboardEvent): void {
        if (this._keyUpBindings.get(event.keyCode) != null) {
            this._keyUpBindings.get(event.keyCode).forEach((func) => func());
        }
    }

    public registerKeyDown(keycode: number, callback: () => void): void {
        if (!this._keyDownBindings.has(keycode)) {
            this._keyDownBindings.set(keycode, new Array<() => void>());
        }
        this._keyDownBindings.get(keycode).push(callback);
    }

    public registerKeyUp(keycode: number, callback: () => void): void {
        if (!this._keyUpBindings.has(keycode)) {
            this._keyUpBindings.set(keycode, new Array<() => void>());
        }
        this._keyUpBindings.get(keycode).push(callback);
    }
}
