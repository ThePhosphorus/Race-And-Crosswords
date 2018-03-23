import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";

import { HudComponent } from "./hud.component";
import { GameManagerService } from "../game-component/game-manager-service/game_manager.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { InputManagerService } from "../input-manager-service/input-manager.service";
import { SoundManagerService } from "../game-component/sound-manager-service/sound-manager.service";
import { CollisionDetectorService } from "../game-component/collision/collision-detector.service";
import { LightManagerService } from "../game-component/light-manager/light-manager.service";
import { RpmBarComponent } from "./rpm-bar/rpm-bar.component";

describe("HudComponent", () => {
    let component: HudComponent;
    let fixture: ComponentFixture<HudComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HudComponent, RpmBarComponent],
            providers: [
                GameManagerService,
                CameraManagerService,
                InputManagerService,
                SoundManagerService,
                CollisionDetectorService,
                LightManagerService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HudComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should reset lap timer on nextLap()", () => {
        const SECONDS: number = 6;
        const MINUTES: number = 3;
        const CENTISECONDS: number = 12;
        const DELTA_TIME: number = 60000 * MINUTES + 1000 * SECONDS + 10 * CENTISECONDS;
        component.lapTimer.update(DELTA_TIME);
        component.nextLap();
        expect(component.lapTimer.centiseconds).toBe(0);
        expect(component.lapTimer.seconds).toBe(0);
        expect(component.lapTimer.minutes).toBe(0);
    });

    it("should increment global timer", () => {
        const SECONDS: number = 6;
        const MINUTES: number = 3;
        const CENTISECONDS: number = 12;
        const DELTA_TIME: number = 60000 * MINUTES + 1000 * SECONDS + 10 * CENTISECONDS;
        component.globalTimer.update(DELTA_TIME);
        expect(component.globalTimer.centiseconds).toBeCloseTo(CENTISECONDS);
        expect(component.globalTimer.seconds).toBeCloseTo(SECONDS);
        expect(component.globalTimer.minutes).toBeCloseTo(MINUTES);
    });

    it("should increment lap count", inject([GameManagerService], (gameManager: GameManagerService) => {
        const START_LAP_COUNT: number = 3;
        component.lapCount = START_LAP_COUNT;
        component.nextLap();
        expect(component.lapCount).toBe(START_LAP_COUNT + 1);
    }));
});
