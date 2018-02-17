import { TestBed, inject } from "@angular/core/testing";
import { TrackSaverService } from "./track-saver.service";

describe("PointsHandler for TrackGeneratorService", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [TrackSaverService]
        });
    });

    it("should be created", inject([TrackSaverService], (service: TrackSaverService) => {
        expect(service).toBeTruthy();
    }));

});
