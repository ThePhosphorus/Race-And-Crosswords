import { TestBed, inject } from "@angular/core/testing";

import { TrackGeneratorPointsHandler } from "./track-generator-pointsHandler";
import { TrackGenerator } from "./track-generator.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { ConstraintValidatorService } from "../constraint-validator/constraint-validator.service";
import { EMPTY_ARRAY_EXCEPTION_MSG } from "../exceptions/EmptyArrayException";
import { Mesh } from "three";
import { OUT_OF_RANGE_EXCEPTION_MSG } from "../exceptions/OutOfRangeException";

describe("PointsHandler for TrackGeneratorService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [TrackGenerator, CameraManagerService, ConstraintValidatorService]
        });
    });

    it("should be created", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        expect(points).toBeTruthy();
    }));

    it("should be empty when created", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        expect(points.length).toBe(0);
    }));

    it("should be able to get filled", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        expect(() => points.push(new Mesh())).not.toThrow();
    }));

    it("should have the number of elements pushed in", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(points.length).toBe(fillNumber);
    }));

    it("should throw EmptyArrayException when empty and trying to access top", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        expect(() => points.top).toThrowError(EMPTY_ARRAY_EXCEPTION_MSG);
    }));

    it("should throw OutOfRangeException when trying to access negative index", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(() => points.point(-1)).toThrowError(OUT_OF_RANGE_EXCEPTION_MSG);
    }));

    it("should throw OutOfRangeException when trying to access index bigger than the number of elements", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(() => points.point(fillNumber)).toThrowError(OUT_OF_RANGE_EXCEPTION_MSG);
    }));

    it("should select the right point", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        const fillNumber: number = 5;
        const selectedPoint: number = 3;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(points.pointSelected()).toBeFalsy();
        points.selectPoint(selectedPoint);
        expect(points.pointSelected()).toBeTruthy();
        expect(points.selectedPointId).toBe(selectedPoint);
    }));

    it("should throw OutOfRangeException when trying to select index bigger than the number of elements", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(() => points.selectPoint(fillNumber)).toThrowError(OUT_OF_RANGE_EXCEPTION_MSG);
    }));

    it("should throw OutOfRangeException when trying to select a negative index", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(() => points.selectPoint(-1)).toThrowError(OUT_OF_RANGE_EXCEPTION_MSG);
    }));

    it("should delete the right point", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        const fillNumber: number = 5;
        const selectedPoint: number = 3;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        points.selectPoint(selectedPoint);
        points.removePoint(selectedPoint);
        expect(points.pointSelected()).toBeFalsy();
        expect(points.length).toBe(fillNumber - 1);
    }));

    it("should throw OutOfRangeException when trying to delete index bigger than the number of elements", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(() => points.removePoint(fillNumber)).toThrowError(OUT_OF_RANGE_EXCEPTION_MSG);
    }));

    it("should throw OutOfRangeException when trying to delete a negative index", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        const fillNumber: number = 5;
        for ( let i: number = 0; i < fillNumber ; i++) {
            points.push(new Mesh());
        }
        expect(() => points.removePoint(-1)).toThrowError(OUT_OF_RANGE_EXCEPTION_MSG);
    }));
});
