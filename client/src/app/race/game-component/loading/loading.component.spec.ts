import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoadingComponent } from "./loading.component";
import { TrackLoaderService } from "../../track-loader/track-loader.service";
import { HttpClientModule } from "@angular/common/http";

describe("LoadingComponent", () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ LoadingComponent ],
      providers: [TrackLoaderService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
