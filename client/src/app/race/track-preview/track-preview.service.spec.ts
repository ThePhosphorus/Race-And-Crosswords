import { TestBed, inject } from "@angular/core/testing";

import { TrackPreviewService } from "./track-preview.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { LoaderService } from "../game-component/loader-service/loader.service";
import { TrackLoaderService } from "../track-loader/track-loader.service";
import { HttpClientModule } from "@angular/common/http/";

describe("TrackPreviewService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [TrackPreviewService, CameraManagerService, LoaderService, TrackLoaderService]
        });
    });

    it("should be created", inject([TrackPreviewService], (service: TrackPreviewService) => {
        expect(service).toBeTruthy();
    }));
});
