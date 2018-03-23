import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RpmBarComponent } from "./rpm-bar.component";
import { GameManagerService } from "../../game-component/game-manager-service/game_manager.service";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { InputManagerService } from "../../input-manager-service/input-manager.service";
import { SoundManagerService } from "../../game-component/sound-manager-service/sound-manager.service";
import { CollisionDetectorService } from "../../game-component/collision/collision-detector.service";
import { LightManagerService } from "../../game-component/light-manager/light-manager.service";

describe("RpmBarComponent", () => {
  let component: RpmBarComponent;
  let fixture: ComponentFixture<RpmBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpmBarComponent ],
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
    fixture = TestBed.createComponent(RpmBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should reset lap timer on nextLap()", () => {
    });

});
