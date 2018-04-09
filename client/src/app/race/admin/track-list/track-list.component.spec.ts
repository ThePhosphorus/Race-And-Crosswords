import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TrackListComponent } from "./track-list.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TrackLoaderService } from "../../track-loader/track-loader.service";
import { HttpClientModule } from "@angular/common/http/";
import { LoaderService } from "../../game-component/loader-service/loader.service";

describe("TrackListComponent", () => {
  let component: TrackListComponent;
  let fixture: ComponentFixture<TrackListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackListComponent],
      schemas : [NO_ERRORS_SCHEMA],
      providers: [TrackLoaderService, LoaderService],
      imports: [HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
