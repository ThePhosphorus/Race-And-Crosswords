import { Object3D } from "three";

export class CarControl extends Object3D {
    private _isAcceleratorPressed: boolean;
    private _isBraking: boolean;
    private _isSteeringLeft: boolean;
    private _isSteeringRight: boolean;
    private _hasHandbrakeOn: boolean;

    public get isAcceleratorPressed(): boolean {
        return this._isAcceleratorPressed;
    }

    public get isBraking(): boolean {
        return this._isBraking;
    }

    public get isSteeringLeft(): boolean {
        return this._isSteeringLeft;
    }

    public get isSteeringRight(): boolean {
        return this._isSteeringRight;
    }

    public get hasHandbrakeOn(): boolean {
        return this._hasHandbrakeOn;
    }

    public constructor() {
        super();
        this._isAcceleratorPressed = false;
        this._isBraking = false;
        this._isSteeringLeft = false;
        this._isSteeringRight = false;
        this._hasHandbrakeOn = false;
    }

    public accelerate(): void {
        this._isAcceleratorPressed = true;
    }

    public steerLeft(): void {
        this._isSteeringLeft = true;
    }

    public steerRight(): void {
        this._isSteeringRight = true;
    }

    public brake(): void {
        this._isBraking = true;
    }

    public releaseSteeringLeft(): void {
        this._isSteeringLeft = false;
    }

    public handBrake(): void {
        this._hasHandbrakeOn = true;
    }

    public releaseHandBrake(): void {
        this._hasHandbrakeOn = false;
    }

    public releaseSteeringRight(): void {
        this._isSteeringRight = false;
    }

    public releaseBrakes(): void {
        this._isBraking = false;
    }

    public releaseAccelerator(): void {
        this._isAcceleratorPressed = false;
    }
}
