import { ConstraintValidator } from "./constraint-validator";
import { Vector3 } from "three";
import { DEFAULT_TRACK_WIDTH } from "../../../race.constants";

/* tslint:disable:no-magic-numbers */

const minTrackLength: number = DEFAULT_TRACK_WIDTH * 2;
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
        points.push(new Vector3(minTrackLength * 2, 0, 0));
        points.push(new Vector3(minTrackLength * 2, 0, minTrackLength * 2));
        points.push(new Vector3(minTrackLength, 0, minTrackLength * 2));
        points.push(new Vector3(minTrackLength, 0, - minTrackLength));
        service.points = points;

        expect(service.validateLine(points[0], points[1])).toBeFalsy();
        expect(service.validateLine(points[points.length - 2], points[points.length - 1])).toBeFalsy();
    });

    it("should return false when track is too short", () => {
        const points: Array<Vector3> = new Array<Vector3>();
        points.push(new Vector3(0, 0, 0));
        points.push(new Vector3(minTrackLength / 2, 0, 0));
        service.points = points;

        expect(service.validateLine(points[0], points[1])).toBeFalsy();
    });

    it("should return false when tracks are closer than the width", () => {
        const points: Array<Vector3> = new Array<Vector3>();
        points.push(new Vector3(0, 0, 0));
        points.push(new Vector3(minTrackLength * 2, 0, 0));
        points.push(new Vector3(minTrackLength * 2, 0, minTrackLength));
        points.push(new Vector3(minTrackLength, 0, minTrackLength / 4));
        service.points = points;

        expect(service.validateLine(points[0], points[1])).toBeFalsy();
        expect(service.validateLine(points[2], points[3])).toBeFalsy();
    });

    it("should return true when no conditions are broken" , () => {
        const points: Array<Vector3> = new Array<Vector3>();
        points.push(new Vector3(0, 0, 0));
        points.push(new Vector3(minTrackLength, 0, 0));
        points.push(new Vector3(minTrackLength, 0, minTrackLength));
        points.push(new Vector3(0, 0, minTrackLength));
        points.push(new Vector3(0, 0, 0));
        service.points = points;

        for (let i: number = 0; i < points.length - 1; i++ ) {
            expect(service.validateLine(points[i], points[i + 1])).toBeTruthy();
        }
    });

});
