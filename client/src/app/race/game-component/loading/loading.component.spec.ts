import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoadingComponent } from "./loading.component";
import { TrackLoaderService } from "../../track-loader/track-loader.service";
import { HttpClientModule } from "@angular/common/http";
import { LoaderService } from "../loader-service/loader.service";
import { Track } from "../../../../../../common/race/track";

describe("LoadingComponent", () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ LoadingComponent ],
      providers: [TrackLoaderService, LoaderService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    component.track = new Track("", "", "", [], 0);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
