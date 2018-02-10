import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TrackEditorComponent } from "./track-editor.component";
import { ReversePipe } from "../reverse-pipe/reverse.pipe";

describe("TrackEditorComponent", () => {
  let component: TrackEditorComponent;
  let fixture: ComponentFixture<TrackEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackEditorComponent, ReversePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
