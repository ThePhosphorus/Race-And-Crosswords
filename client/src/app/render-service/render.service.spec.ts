import { TestBed, inject } from "@angular/core/testing";
import { RenderService } from "./render.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { InputManagerService } from "../input-manager-service/input-manager.service";
import { SoundManagerService } from "../sound-manager-service/sound-manager.service";

describe("RenderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService, CameraManagerService, InputManagerService, SoundManagerService]
        });
    });

    it(
        "should be created",
        inject([RenderService], (service: RenderService) => {
            expect(service).toBeTruthy();
        })
    );

    // No additional tests can be made because we cannot create a configurable HTMLDivElement
});
