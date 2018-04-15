import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HighscoreAdderComponent } from "./highscore-adder.component";
import { FormsModule } from "@angular/forms";
import { EndGameService } from "../end-game-service/end-game.service";
import { LoaderService } from "../../loader-service/loader.service";
import { HttpHandler, HttpClient } from "@angular/common/http";
import { TrackLoaderService } from "../../../track-loader/track-loader.service";

describe("HighscoreAdderComponent", () => {
  let component: HighscoreAdderComponent;
  let fixture: ComponentFixture<HighscoreAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighscoreAdderComponent ],
      imports: [FormsModule],
      providers: [EndGameService, TrackLoaderService, HttpClient, HttpHandler, LoaderService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighscoreAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
