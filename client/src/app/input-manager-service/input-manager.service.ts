import { Injectable } from "@angular/core";

@Injectable()
export class InputManagerService {

    private keyUpBindings: Map<number, Array<() => void>>;
    private keyDownBindings: Map<number, Array<() => void>>;

    public constructor() {
        this.resetBindings();
    }

    public resetBindings(): void {
        this.keyDownBindings = new Map<number, Array<() => void>>();
        this.keyUpBindings = new Map<number, Array<() => void>>();
    }

    public handleKeyDown(event: KeyboardEvent): void {
        if (this.keyDownBindings.get(event.keyCode) != null) {
            this.keyDownBindings.get(event.keyCode).forEach((func) => func());
        }
    }

    public handleKeyUp(event: KeyboardEvent): void {
        if (this.keyUpBindings.get(event.keyCode) != null) {
            this.keyUpBindings.get(event.keyCode).forEach((func) => func());
        }
    }

    public registerKeyDown(keycode: number, callback: () => void): void {
        if (!this.keyDownBindings.has(keycode)) {
            this.keyDownBindings.set(keycode, new Array<() => void>());
        }
        this.keyDownBindings.get(keycode).push(callback);
    }

    public registerKeyUp(keycode: number, callback: () => void): void {
        if (!this.keyUpBindings.has(keycode)) {
            this.keyUpBindings.set(keycode, new Array<() => void>());
        }
        this.keyUpBindings.get(keycode).push(callback);
    }
}
