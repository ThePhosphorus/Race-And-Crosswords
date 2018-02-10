import { TestBed, inject } from "@angular/core/testing";

import { TrackGeneratorPointsHandler } from "./track-generator-pointsHandler";
import { TrackGenerator } from "./track-generator.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { ConstraintValidatorService } from "../constraint-validator/constraint-validator.service";

describe("ConstraintValidatorService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [TrackGenerator, CameraManagerService, ConstraintValidatorService]
        });
    });

    it("should be created", inject([TrackGenerator], (trackGen: TrackGenerator) => {
        const points: TrackGeneratorPointsHandler = new TrackGeneratorPointsHandler(trackGen);
        expect(points).toBeTruthy();
    }));
});
