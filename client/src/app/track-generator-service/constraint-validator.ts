import { Vector3 } from "three";

const MINIMUM_ANGLE: number = 2.35619;
const TWICE_TRACK_WIDTH: number = 5;

export class ConstraintValidator {
    public static validateLine(index1: number, index2: number, points: Array<Vector3>): boolean {
        const line: Vector3 = new Vector3().subVectors(points[index2], points[index1]);
        const previousLine: Vector3 = points[index1 - 1] ? new Vector3().subVectors(points[index1], points[index1 - 1]) : null;
        const nextLine: Vector3 = points[index2 + 1] ? new Vector3().subVectors(points[index2 + 1], points[index2]) : null;

        return this.validateLength(line)
            && this.validateAngle(previousLine, line)
            && this.validateAngle(line, nextLine)
            && this.validateIntersection(index1, index2, points);
    }

    private static validateLength(v: Vector3): boolean {
        return v != null && v.length() > TWICE_TRACK_WIDTH;
    }

    private static validateAngle(v1: Vector3, v2: Vector3): boolean {
        return (v1 == null || v2 == null) || v1.angleTo(v2) < MINIMUM_ANGLE;
    }

    private static validateIntersection(index1: number, index2: number, points: Array<Vector3>): boolean {
        const line: Vector3 = new Vector3().subVectors(points[index2], points[index1]);
        for (let i: number = 0; i < points.length - 1; i++) {
            if (points[i + 1] != null && i !== index1 && i + 1 !== index2) {
                const compare: Vector3 = new Vector3().subVectors(points[i + 1], points[i]);
                const denominator: number = (compare.z * line.x) - (compare.x * line.z);
                if (denominator === 0) {
                    return false;
                }
                let a: number = points[index1].z - points[i].z;
                let b: number = points[index1].x - points[i].x;
                const numerator1: number = ((points[i + 1].x - points[i].x) * a) - ((points[i + 1].z - points[i].z) * b);
                const numerator2: number = ((points[index2].x - points[index1].x) * a) - ((points[index2].z - points[index1].z) * b);
                a = numerator1 / denominator;
                b = numerator2 / denominator;

                if (a > 0 && a < 1 && b > 0 && b < 1) {
                    return false;
                }
            }
        }

        return true;
    }
}
