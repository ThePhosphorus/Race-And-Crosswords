import { ConstraintValidator } from "./constraint-validator";
import { Vector3 } from "three";

describe("ConstraintValidatorService", () => {
    const service: ConstraintValidator = new ConstraintValidator();

    it("should be created",  () => {
        expect(service).toBeTruthy();
    });

    it("Setting points shouldn't throw", () => {
        const points: Array<Vector3> = new Array<Vector3>();
        expect(() => service.points = points ).not.toThrow();
    });

    it("should return false when segments cross" , () => {
        const points: Array<Vector3> = new Array<Vector3>();
        points.push(new Vector3(0, 0, 0));
        points.push(new Vector3(1, 0, 0));
        points.push(new Vector3(1, 0, 1));
        points.push(new Vector3(0, 0, 1));
        points.push(new Vector3(2, 0, 0));
        service.points = points;

        expect(service.validateLine(points[0], points[1])).toBeFalsy();
    });

    it("should return true when segments cross by their end point" , () => {
        const points: Array<Vector3> = new Array<Vector3>();
        points.push(new Vector3(0, 0, 0));
        points.push(new Vector3(1, 0, 0));
        points.push(new Vector3(1, 0, 1));
        points.push(new Vector3(0, 0, 1));
        // points.push(new Vector3(0, 0, 0));
        service.points = points;

        for (let i: number = 0; i < points.length - 1; i++ ) {
            expect(service.validateLine(points[i], points[i + 1])).toBeTruthy();
        }
    });
});
