import { TestBed, inject } from "@angular/core/testing";
import { GameManagerService } from "./game_manager.service";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { InputManagerService } from "../../input-manager-service/input-manager.service";
import { SoundManagerService } from "../sound-manager-service/sound-manager.service";
import { CollisionDetectorService } from "../collision/collision-detector.service";
import { LightManagerService } from "../light-manager/light-manager.service";
import { LoaderService } from "../loader-service/loader.service";
import { GameConfiguration } from "../game-configuration/game-configuration";
import { NB_LAPS } from "../../../global-constants/constants";

// tslint:disable:no-magic-numbers
describe("GameManager", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameManagerService,
                        CameraManagerService,
                        InputManagerService,
                        SoundManagerService,
                        CollisionDetectorService,
                        LightManagerService,
                        LoaderService]
        });
    });

    it("should be created", inject([GameManagerService], (service: GameManagerService) => {
        expect(service).toBeTruthy();
    }));

    it("should initialize the game", inject([GameManagerService], (service: GameManagerService) => {
        service.start(document.createElement("div"), new GameConfiguration());
        expect(service.playerInfos.lap).toBeDefined();
        expect(service.isStarted).toBeFalsy();
    }));

    it("should start the game", inject([GameManagerService], (service: GameManagerService) => {
        service.start(document.createElement("div"), new GameConfiguration());
        expect(service.isStarted).toBeFalsy();
        service.startGame();
        expect(service.isStarted).toBeTruthy();
    }));

    it("should start at lap 0", inject([GameManagerService], (service: GameManagerService) => {
        service.start(document.createElement("div"), new GameConfiguration());
        service.startGame();
        expect(service.playerInfos.lap).toBeLessThan(NB_LAPS);
    }));

    it("should have 3 laps", () => {
        expect(NB_LAPS).toBe(3);
    });
});
