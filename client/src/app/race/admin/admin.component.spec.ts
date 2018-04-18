import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminComponent } from "./admin.component";
import { TrackLoaderService } from "../track-loader/track-loader.service";
import { TrackSaverService } from "./track-saver/track-saver.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("AdminComponent", () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminComponent ],
      providers: [TrackLoaderService, TrackSaverService],
      schemas : [NO_ERRORS_SCHEMA]
    })
    .compileComponents().catch((e: Error) => console.error(e.message));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
