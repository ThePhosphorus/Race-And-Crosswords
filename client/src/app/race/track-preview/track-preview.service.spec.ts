import { TestBed, inject } from "@angular/core/testing";

import { TrackPreviewService } from "./track-preview.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";

describe("TrackPreviewService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TrackPreviewService, CameraManagerService]
        });
    });

    it("should be created", inject([TrackPreviewService], (service: TrackPreviewService) => {
        expect(service).toBeTruthy();
    }));
});
