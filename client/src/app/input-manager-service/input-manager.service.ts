import { Injectable } from "@angular/core";

@Injectable()
export class InputManagerService {

    private keyUpBindings: Map<number, Array<() => void>>;
    private keyDownBindings: Map<number, Array<() => void>>;

    private mouseDownBindings: Map<number, Array<(event: MouseEvent) => void>>;
    private mouseUpBindings: Map<number, Array<(event: MouseEvent) => void>>;
    private mouseMoveBindings: Map<number, Array<(event: MouseEvent) => void>>;

    public constructor() {
        this.resetBindings();
    }

    public resetBindings(): void {
        this.keyDownBindings = new Map<number, Array<() => void>>();
        this.keyUpBindings = new Map<number, Array<() => void>>();
        this.mouseDownBindings = new Map<number, Array<(event: MouseEvent) => void>>();
        this.mouseUpBindings = new Map<number, Array<(event: MouseEvent) => void>>();
        this.mouseMoveBindings = new Map<number, Array<(event: MouseEvent) => void>>();
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

    public handleMouseDown(event: MouseEvent): void {
        if (this.mouseDownBindings.get(event.button) != null) {
            this.mouseDownBindings.get(event.button).forEach((func) => func(event));
        }
    }

    public handleMouseUp(event: MouseEvent): void {
        if (this.mouseUpBindings.get(event.button) != null) {
            this.mouseUpBindings.get(event.button).forEach((func) => func(event));
        }
    }

    public handleMouseMove(event: MouseEvent): void {
        if (this.mouseMoveBindings.get(event.button) != null) {
            this.mouseMoveBindings.get(event.button).forEach((func) => func(event));
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

    public registerMouseDown(button: number, callback: (event: MouseEvent) => void): void {
        if (!this.mouseDownBindings.has(button)) {
            this.mouseDownBindings.set(button, new Array<(event: MouseEvent) => void>());
        }
        this.mouseDownBindings.get(button).push(callback);
    }

    public registerMouseUp(button: number, callback: (event: MouseEvent) => void): void {
        if (!this.mouseUpBindings.has(button)) {
            this.mouseUpBindings.set(button, new Array<(event: MouseEvent) => void>());
        }
        this.mouseUpBindings.get(button).push(callback);
    }

    public registerMouseMove(button: number, callback: (event: MouseEvent) => void): void {
        if (!this.mouseMoveBindings.has(button)) {
            this.mouseMoveBindings.set(button, new Array<(event: MouseEvent) => void>());
        }
        this.mouseMoveBindings.get(button).push(callback);
    }
}
