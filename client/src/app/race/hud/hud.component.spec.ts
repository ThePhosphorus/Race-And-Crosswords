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
      declarations: [ HudComponent, RpmBarComponent ],
      providers: [GameManagerService,
                  CameraManagerService,
                  InputManagerService,
                  SoundManagerService,
                  CollisionDetectorService,
                  LightManagerService]
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

  it("should increment lap count", inject([GameManagerService], (gameManager: GameManagerService) => {
    const START_LAP_COUNT: number = 3;
    component.lapCount = START_LAP_COUNT;
    component.nextLap();
    gameManager.update(10);
    expect(component.lapCount).toBe(START_LAP_COUNT + 1);
  });
});
