import { Vector3 } from "three";

const MINIMUM_ANGLE: number = 2.35619;
const LAST_POINT_INDEX: number = 2;

const TWICE_TRACK_WIDTH: number = 5; // Temporary constant while we don't know the track width

export class ConstraintValidator {
    private _points: Array<Vector3>;

    public constructor() {
    }

    public set points(points: Array<Vector3>) {
        this._points = points;
    }

    public validateLine(p1: Vector3, p2: Vector3): boolean {
        const line: Vector3 = new Vector3().subVectors(p2, p1);
        const previousLine: Vector3 = this.findPreviousLine(p1);
        const nextLine: Vector3 = this.findNextLine(p2);

        return this.validateLength(line)
            && this.validateAngle(previousLine, line)
            && this.validateAngle(line, nextLine)
            && this.validateIntersection(p1, p2);
    }

    private findNextLine(point: Vector3): Vector3 {
        const index: number = this._points.findIndex((p) => p.equals(point));
        if (index === null) {
            return null;
        }

        const nextIndex: number = (index !== this._points.length - 1) ? index + 1 :
            (this._points[this._points.length - 1].equals(this._points[0])) ? 0 : null;

        return this._points[nextIndex] ? new Vector3().subVectors(this._points[nextIndex], point) : null;
    }

    private findPreviousLine(point: Vector3): Vector3 {
        const index: number = this._points.findIndex((p) => p.equals(point));
        const previousIndex: number = (index !== 0) ? index - 1 :
            (this._points[this._points.length - 1].equals(this._points[0])) ? this._points.length - LAST_POINT_INDEX : null;

        return this._points[previousIndex] ? new Vector3().subVectors(point, this._points[previousIndex]) : null;
    }

    private validateLength(v: Vector3): boolean {
        return v != null && v.length() > TWICE_TRACK_WIDTH;
    }

    private validateAngle(v1: Vector3, v2: Vector3): boolean {
        return (v1 == null || v2 == null) || v1.angleTo(v2) < MINIMUM_ANGLE;
    }

    private isCounterClockWise(p1: Vector3, p2: Vector3, p3: Vector3): boolean {
        return (p3.z - p1.z) * (p2.x - p1.x) > (p2.z - p1.z) * (p3.x - p1.x);
    }

    private areDifferentPoints(p1: Vector3, p2: Vector3, p3: Vector3, p4: Vector3): boolean {
        return !(p1.equals(p2) || p1.equals(p3) || p1.equals(p4) || p2.equals(p3) || p2.equals(p4) || p3.equals(p4));
    }

    private validateIntersection(p1: Vector3, p2: Vector3): boolean {
        for (let i: number = 0; i < this._points.length - 1; i++) {
            const p3: Vector3 = this._points[i];
            const p4: Vector3 = this._points[i + 1];
            if (this.areDifferentPoints(p1, p2, p3, p4)) {
                const doesIntersect: boolean = this.isCounterClockWise(p1, p3, p4) !== this.isCounterClockWise(p2, p3, p4)
                                            && this.isCounterClockWise(p1, p2, p3) !== this.isCounterClockWise(p1, p2, p4);
                if (doesIntersect) {
                    return false;
                }
            }
        }

        return true;
    }
}
