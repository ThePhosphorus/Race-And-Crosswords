import { TestBed, inject } from "@angular/core/testing";

import { TrackGeneratorPointsHandler } from "./track-generator-pointsHandler";
import { TrackGenerator } from "./track-generator.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { ConstraintValidatorService } from "../constraint-validator/constraint-validator.service";
import { EmptyArrayException } from "../exceptions/EmptyArrayException";

describe("PointsHandlerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [TrackGenerator, CameraManagerService, ConstraintValidatorService]
        });
    });

    it("should be created", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        expect(points).toBeTruthy();
    }));

    it("when created, should be empty", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        expect(points.length).toBe(0);
    }));

    it("when empty and trying to access top, should throw EmptyArrayException", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        expect(() => points.top).toThrowError(new EmptyArrayException().message);
    }));
});
