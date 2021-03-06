import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RpmBarComponent } from "./rpm-bar.component";
import { GameManagerService } from "../../game-component/game-manager-service/game_manager.service";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { InputManagerService } from "../../input-manager-service/input-manager.service";
import { SoundManagerService } from "../../game-component/sound-manager-service/sound-manager.service";
import { CollisionDetectorService } from "../../game-component/collision/collision-detector.service";
import { LightManagerService } from "../../game-component/light-manager/light-manager.service";
import { LoaderService } from "../../game-component/loader-service/loader.service";
import { EndGameService } from "../../game-component/end-game/end-game-service/end-game.service";
import { TrackLoaderService } from "../../track-loader/track-loader.service";
import { HttpClient, HttpHandler } from "@angular/common/http";

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
                  LightManagerService,
                  LoaderService,
                  EndGameService,
                  TrackLoaderService,
                  HttpClient,
                  HttpHandler
                ]
    })
    .compileComponents().catch((e: Error) => console.error(e.message));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpmBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
