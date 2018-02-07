import { Vector3 } from "three";

const MINIMUM_ANGLE: number = 0.785398;
const MINIMUM_LENGTH: number = 5;

class ConstraintValidator {
    public static validateLine(index1: number, index2: number, points: Array<Vector3>): boolean {
        const line: Vector3 = points[index2].sub(points[index1]);
        const previousLine: Vector3 = points[index1 - 1] ? points[index1].sub(points[index1 - 1]) : null;
        const nextLine: Vector3 = points[index2 + 1] ? points[index2 + 1].sub(points[index2]) : null;

        return this.validateLength(line)
            && this.validateAngle(previousLine, line)
            && this.validateAngle(line, nextLine);
    }

    private static validateLength(v: Vector3): boolean {
        return v != null && v.length() > MINIMUM_LENGTH;
    }

    private static validateAngle(v1: Vector3, v2: Vector3): boolean {
        return (v1 != null && v2 != null) && v1.angleTo(v2) > MINIMUM_ANGLE;
    }
}
