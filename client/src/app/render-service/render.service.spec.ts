import { TestBed, inject } from "@angular/core/testing";
import { RenderService } from "./render.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";

describe("RenderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService, CameraManagerService]
        });
    });

    it(
        "should be created",
        inject([RenderService], (service: RenderService) => {
            expect(service).toBeTruthy();
        })
    );
});
