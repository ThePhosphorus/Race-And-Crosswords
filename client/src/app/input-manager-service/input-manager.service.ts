import { Injectable } from "@angular/core";

@Injectable()
export class InputManagerService {

    private keyUpBindings: Map<number, Array<() => void>>;
    private keyDownBindings: Map<number, Array<() => void>>;

    private mouseDownBindings: Array<(event: MouseEvent) => void>;
    private mouseUpBindings: Array<(event: MouseEvent) => void>;
    private mouseMoveBindings: Array<(event: MouseEvent) => void>;

    public constructor() {
        this.resetBindings();
    }

    public resetBindings(): void {
        this.keyDownBindings = new Map<number, Array<() => void>>();
        this.keyUpBindings = new Map<number, Array<() => void>>();
        this.mouseDownBindings = new Array<(event: MouseEvent) => void>();
        this.mouseUpBindings = new Array<(event: MouseEvent) => void>();
        this.mouseMoveBindings = new Array<(event: MouseEvent) => void>();
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
        this.mouseDownBindings.forEach((func) => func(event));
    }

    public handleMouseUp(event: MouseEvent): void {
        this.mouseUpBindings.forEach((func) => func(event));
    }

    public handleMouseMove(event: MouseEvent): void {
        this.mouseMoveBindings.forEach((func) => func(event));
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

    public registerMouseDown(callback: (event: MouseEvent) => void): void {
        this.mouseDownBindings.push(callback);
    }

    public registerMouseUp(callback: (event: MouseEvent) => void): void {
        this.mouseUpBindings.push(callback);
    }

    public registerMouseMove(callback: (event: MouseEvent) => void): void {
        this.mouseMoveBindings.push(callback);
    }
}
