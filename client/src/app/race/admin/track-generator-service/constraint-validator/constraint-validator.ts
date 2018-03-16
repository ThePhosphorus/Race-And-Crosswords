import { Vector3 } from "three";
import { TWICE_TRACK_WIDTH, DEFAULT_TRACK_WIDTH } from "../../../race.constants";

const MINIMUM_ANGLE: number = 2.35619;
const LAST_POINT_INDEX: number = 2;

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
            && this.validateIntersection(p1, p2)
            && this.validatePointLineDistance(p1, p2)
            && this.validateLinePointDistance(p1, p2);
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

    private pointLineDistance(l1: Vector3, l2: Vector3, p: Vector3): number {
        const ap: Vector3 = new Vector3().subVectors(p, l1);
        const ab: Vector3 = new Vector3().subVectors(l2, l1);
        const abLength: number = ab.length();

        const projected: number = (ap.clone().dot(ab) / ab.clone().dot(ab)) * abLength;
        if (projected > 0 && projected < abLength) {
            const a: number = Math.abs((l2.z - l1.z) * p.x - (l2.x - l1.x) * p.z + l2.x * l1.z - l2.z * l1.x);
            const b: number = Math.sqrt((l2.z - l1.z) * (l2.z - l1.z) + (l2.x - l1.x) * (l2.x - l1.x));

            return a / b;
        } else {
            return Math.min(p.distanceTo(l1), p.distanceTo(l2));
        }

    }

    private validatePointLineDistance(l1: Vector3, l2: Vector3): boolean {
        for (const p of this._points) {
            if (!p.equals(l1) && !p.equals(l2)) {
                const isTooClose: boolean = this.pointLineDistance(l1, l2, p) < DEFAULT_TRACK_WIDTH;
                if (isTooClose) {
                    return false;
                }
            }
        }

        return true;
    }

    private validateLinePointDistance(p1: Vector3, p2: Vector3): boolean {
        for (let i: number = 0; i < this._points.length - 1; i++) {
            const p3: Vector3 = this._points[i];
            const p4: Vector3 = this._points[i + 1];
            if (this.areDifferentPoints(p1, p2, p3, p4)) {
                const firstLineInvalid: boolean = this.pointLineDistance(p3, p4, p1) < DEFAULT_TRACK_WIDTH;
                const secondLineInvalid: boolean = this.pointLineDistance(p3, p4, p2) < DEFAULT_TRACK_WIDTH;
                if (firstLineInvalid || secondLineInvalid) {
                    return false;
                }
            }
        }

        return true;
    }
}
