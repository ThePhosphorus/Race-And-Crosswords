import { TestBed, inject } from "@angular/core/testing";
import { GameManagerService } from "./game_manager.service";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { InputManagerService } from "../../input-manager-service/input-manager.service";
import { SoundManagerService } from "../sound-manager-service/sound-manager.service";

describe("RenderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameManagerService, CameraManagerService, InputManagerService, SoundManagerService]
        });
    });

    it(
        "should be created",
        inject([GameManagerService], (service: GameManagerService) => {
            expect(service).toBeTruthy();
        })
    );

    // No additional tests can be made because we cannot create a configurable HTMLDivElement
});
