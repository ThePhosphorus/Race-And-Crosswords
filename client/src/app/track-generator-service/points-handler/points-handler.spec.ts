import { TestBed } from "@angular/core/testing";

import { PointsHandler } from "./points-handler";
import { TrackGenerator } from "../track-generator.service";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { ConstraintValidatorService } from "../constraint-validator/constraint-validator";
import { EMPTY_ARRAY_EXCEPTION_MSG } from "../../exceptions/EmptyArrayException";
import { Mesh } from "three";
import { OUT_OF_RANGE_EXCEPTION_MSG } from "../../exceptions/OutOfRangeException";

describe("PointsHandler for TrackGeneratorService", () => {
    const cameraManager: CameraManagerService = new CameraManagerService();
    const constraints: ConstraintValidatorService = new ConstraintValidatorService();
    const trackGen: TrackGenerator = new TrackGenerator(cameraManager, constraints);

    beforeEach(async () => {
        TestBed.configureTestingModule({
        providers: [TrackGenerator, CameraManagerService, ConstraintValidatorService]
        });
        const div: HTMLDivElement = document.createElement("div");
        trackGen.setContainer(div);
        constraints.setPoints(trackGen.points.points);
    });

    it("should be created",  () => {
        const points: PointsHandler = new PointsHandler(trackGen);
        expect(points).toBeTruthy();
    });

    it("should be empty when created",  () => {
        const points: PointsHandler = new PointsHandler(trackGen);
        expect(points.length).toBe(0);
    });

    it("should be able to get filled", () => {
        const points: PointsHandler = new PointsHandler(trackGen);
        expect(() => points.push(new Mesh())).not.toThrow();
    });

    it("should have the number of elements pushed in", () => {
        const points: PointsHandler = new PointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(points.length).toBe(fillNumber);
    });

    it("should throw EmptyArrayException when empty and trying to access top",  () => {
        const points: PointsHandler = new PointsHandler(trackGen);
        expect(() => points.top).toThrowError(EMPTY_ARRAY_EXCEPTION_MSG);
    });

    it("should throw OutOfRangeException when trying to access negative index",  () => {
        const points: PointsHandler = new PointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(() => points.point(-1)).toThrowError(OUT_OF_RANGE_EXCEPTION_MSG);
    });

    it("should throw OutOfRangeException when trying to access index bigger than the number of elements", () => {
        const points: PointsHandler = new PointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(() => points.point(fillNumber)).toThrowError(OUT_OF_RANGE_EXCEPTION_MSG);
    });

    it("should select the right point", () => {
        const points: PointsHandler = new PointsHandler(trackGen);
        const fillNumber: number = 5;
        const selectedPoint: number = 3;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(points.pointSelected()).toBeFalsy();
        points.selectPoint(selectedPoint);
        expect(points.pointSelected()).toBeTruthy();
        expect(points.selectedPointId).toBe(selectedPoint);
    });

    it("should throw OutOfRangeException when trying to select index bigger than the number of elements", () => {
        const points: PointsHandler = new PointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(() => points.selectPoint(fillNumber)).toThrowError(OUT_OF_RANGE_EXCEPTION_MSG);
    });

    it("should throw OutOfRangeException when trying to select a negative index", () => {
        const points: PointsHandler = new PointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(() => points.selectPoint(-1)).toThrowError(OUT_OF_RANGE_EXCEPTION_MSG);
    });

    it("should delete the right point", () => {
        const points: PointsHandler = new PointsHandler(trackGen);
        const fillNumber: number = 5;
        const selectedPoint: number = 3;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        points.selectPoint(selectedPoint);
        points.removePoint(selectedPoint);
        expect(points.pointSelected()).toBeFalsy();
        expect(points.length).toBe(fillNumber - 1);
    });

    it("should throw OutOfRangeException when trying to delete index bigger than the number of elements", () => {
        const points: PointsHandler = new PointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(() => points.removePoint(fillNumber)).toThrowError(OUT_OF_RANGE_EXCEPTION_MSG);
    });

    it("should throw OutOfRangeException when trying to delete a negative index", () => {
        const points: PointsHandler = new PointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(() => points.removePoint(-1)).toThrowError(OUT_OF_RANGE_EXCEPTION_MSG);
    });
});
