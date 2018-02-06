import { MIN_TO_SEC } from "../constants";
import { InvalidArgumentError } from "../invalidArgumentError";

export const DEFAULT_DRIVE_RATIO: number = 3.27;
export const DEFAULT_DOWNSHIFT_RPM: number = 2500;
export const DEFAULT_MINIMUM_RPM: number = 800;
export const DEFAULT_SHIFT_RPM: number = 5500;
export const DEFAULT_TRANSMISSION_EFFICIENCY: number = 0.7;
export const DEFAULT_MAX_RPM: number = 7000;
/* tslint:disable: no-magic-numbers */
export const DEFAULT_GEAR_RATIOS: number[] = [
    4.4,
    2.59,
    1.8,
    1.34,
    1,
    0.75
];
/* tslint:enable: no-magic-numbers */

export class Engine {
    private _currentGear: number;
    private _rpm: number;
    private gearRatios: number[];
    private driveRatio: number;
    private downshiftRPM: number;
    private minimumRPM: number;
    private shiftRPM: number;
    private transmissionEfficiency: number;

    public get currentGear(): number {
        return this._currentGear;
    }

    public get rpm(): number {
        return this._rpm;
    }

    public constructor(
        gearRatios: number[] = DEFAULT_GEAR_RATIOS,
        driveRatio: number = DEFAULT_DRIVE_RATIO,
        downshiftRPM: number = DEFAULT_DOWNSHIFT_RPM,
        minimumRpm: number = DEFAULT_MINIMUM_RPM,
        shiftRPM: number = DEFAULT_SHIFT_RPM,
        transmissionEfficiency: number = DEFAULT_TRANSMISSION_EFFICIENCY) {

        if (gearRatios === undefined || gearRatios.length === 0 || gearRatios.some((v) => v <= 0)) {
            gearRatios = DEFAULT_GEAR_RATIOS;
        }

        if (driveRatio <= 0) {
            driveRatio = DEFAULT_DRIVE_RATIO;
        }

        if (downshiftRPM <= 0 || minimumRpm <= 0 || shiftRPM <= downshiftRPM) {
            downshiftRPM = DEFAULT_DOWNSHIFT_RPM;
            minimumRpm = DEFAULT_MINIMUM_RPM;
            shiftRPM = DEFAULT_SHIFT_RPM;
        }

        if (transmissionEfficiency <= 0) {
            transmissionEfficiency = DEFAULT_TRANSMISSION_EFFICIENCY;
        }

        // TODO: check all interactions with RPM values, such as downshift vs minimumrpm, upshift maximum, etc.
        this.gearRatios = gearRatios;
        this.driveRatio = driveRatio;
        this.downshiftRPM = downshiftRPM;
        this.minimumRPM = minimumRpm;
        this.shiftRPM = shiftRPM;
        this.transmissionEfficiency = transmissionEfficiency;

        this._currentGear = 0;
        this._rpm = this.minimumRPM;
    }

    public update(speed: number, wheelRadius: number): void {
        this._rpm = this.getRPM(speed, wheelRadius);
        this.handleTransmission(speed, wheelRadius);
    }

    public getDriveTorque(): number {
        return this.getTorque() * this.driveRatio * this.gearRatios[this.currentGear] * this.transmissionEfficiency;
    }

    private handleTransmission(speed: number, wheelRadius: number): void {
        if (this.shouldShift()) {
            this._currentGear++;
            this._rpm = this.getRPM(speed, wheelRadius);
        } else if (this.shouldDownshift()) {
            this._currentGear--;
            this._rpm = this.getRPM(speed, wheelRadius);
        }
    }

    private getRPM(speed: number, wheelRadius: number): number {
        if (speed < 0) {
            speed = 0;
            console.error("Speed cannot be negative, using 0 as a fallback value.");
        }

        if (wheelRadius <= 0) {
            throw new InvalidArgumentError("wheelRadius cannot be negative.");
        }

        const wheelAngularVelocity: number = speed / wheelRadius;
        // tslint:disable-next-line: no-magic-numbers
        let rpm: number = (wheelAngularVelocity / (Math.PI * 2)) * MIN_TO_SEC * this.driveRatio * this.gearRatios[this._currentGear];
        rpm = rpm < this.minimumRPM ? this.minimumRPM : rpm;

        return rpm > DEFAULT_MAX_RPM ? DEFAULT_MAX_RPM : rpm;

    }

    private getTorque(): number {
        // Polynomial function to approximage a torque curve from the rpm.
        /* tslint:disable: no-magic-numbers */
        return -Math.pow(this._rpm, 6) * 0.0000000000000000001
            + Math.pow(this._rpm, 5) * 0.000000000000003
            - Math.pow(this._rpm, 4) * 0.00000000003
            + Math.pow(this.rpm, 3) * 0.0000002
            - Math.pow(this._rpm, 2) * 0.0006
            + this._rpm * 0.9905
            - 371.88;
        /* tslint:enable: no-magic-numbers */
    }

    private shouldShift(): boolean {
        return this._rpm > this.shiftRPM && this._currentGear < this.gearRatios.length - 1;
    }

    private shouldDownshift(): boolean {
        return this._rpm <= this.downshiftRPM && this._currentGear > 0;
    }
}
