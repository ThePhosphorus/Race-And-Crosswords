import { TestBed, inject } from "@angular/core/testing";
import { GameManagerService, OFF_ROAD_PATH } from "./game_manager.service";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { InputManagerService } from "../../input-manager-service/input-manager.service";
import { SoundManagerService } from "../sound-manager-service/sound-manager.service";
import { CollisionDetectorService } from "../collision/collision-detector.service";
import { LightManagerService } from "../light-manager/light-manager.service";
import { TRACK_PATH } from "../../track-loader/track-loader.service";

describe("GameManager", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameManagerService,
                        CameraManagerService,
                        InputManagerService,
                        SoundManagerService,
                        CollisionDetectorService,
                        LightManagerService]
        });
    });

    it(
        "should be created",
        inject([GameManagerService], (service: GameManagerService) => {
            expect(service).toBeTruthy();
        })
    );

    it("should have different texture for offroad", () => {
        expect(OFF_ROAD_PATH !== TRACK_PATH).toBeTruthy();
    });
});
