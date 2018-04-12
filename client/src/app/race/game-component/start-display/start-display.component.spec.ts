import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { StartDisplayComponent } from "./start-display.component";
import { GameManagerService } from "../game-manager-service/game_manager.service";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { InputManagerService } from "../../input-manager-service/input-manager.service";
import { SoundManagerService } from "../sound-manager-service/sound-manager.service";
import { LoaderService } from "../loader-service/loader.service";
import { CollisionDetectorService } from "../collision/collision-detector.service";
import { LightManagerService } from "../light-manager/light-manager.service";
import { EndGameService } from "../end-game-service/end-game.service";

describe("StartDisplayComponent", () => {
    let component: StartDisplayComponent;
    let fixture: ComponentFixture<StartDisplayComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StartDisplayComponent],
            providers: [GameManagerService,
                        CameraManagerService,
                        InputManagerService,
                        SoundManagerService,
                        LoaderService,
                        CollisionDetectorService,
                        LightManagerService,
                        EndGameService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StartDisplayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
