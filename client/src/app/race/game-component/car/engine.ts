import { MIN_TO_SEC } from "../../../global-constants/constants";
import { InvalidArgumentError } from "../../../invalidArgumentError";
import { DEFAULT_GEAR_RATIOS,
    DEFAULT_DRIVE_RATIO,
    DEFAULT_DOWNSHIFT_RPM,
    DEFAULT_MINIMUM_RPM,
    DEFAULT_SHIFT_RPM,
    DEFAULT_TRANSMISSION_EFFICIENCY,
    DEFAULT_MAX_RPM
} from "../../race.constants";

export class Engine {
    private _currentGear: number;
    private _rpm: number;
    private _gearRatios: number[];
    private _driveRatio: number;
    private _downshiftRPM: number;
    private _minimumRPM: number;
    private _shiftRPM: number;
    private _transmissionEfficiency: number;

    public get currentGear(): number {
        return this._currentGear;
    }

    public get rpm(): number {
        return this._rpm;
    }

    public constructor(
        gearRatios: Array<number> = DEFAULT_GEAR_RATIOS,
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

        this._gearRatios = gearRatios;
        this._driveRatio = driveRatio;
        this._downshiftRPM = downshiftRPM;
        this._minimumRPM = minimumRpm;
        this._shiftRPM = shiftRPM;
        this._transmissionEfficiency = transmissionEfficiency;

        this._currentGear = 0;
        this._rpm = this._minimumRPM;
    }

    public update(speed: number, wheelRadius: number): void {
        this._rpm = this.getRPM(speed, wheelRadius);
        this.handleTransmission(speed, wheelRadius);
    }

    public getDriveTorque(): number {
        return this.getTorque() * this._driveRatio * this._gearRatios[this.currentGear] * this._transmissionEfficiency;
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
        }

        if (wheelRadius <= 0) {
            throw new InvalidArgumentError("wheelRadius cannot be negative.");
        }

        const wheelAngularVelocity: number = speed / wheelRadius;
        let rpm: number = (wheelAngularVelocity / (Math.PI * 2)) * MIN_TO_SEC * this._driveRatio * this._gearRatios[this._currentGear];
        rpm = rpm < this._minimumRPM ? this._minimumRPM : rpm;

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
        return this._rpm > this._shiftRPM && this._currentGear < this._gearRatios.length - 1;
    }

    private shouldDownshift(): boolean {
        return this._rpm <= this._downshiftRPM && this._currentGear > 0;
    }
}
