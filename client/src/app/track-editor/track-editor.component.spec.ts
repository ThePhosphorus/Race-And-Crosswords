import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TrackEditorComponent } from "./track-editor.component";
import { ReversePipe } from "../reverse-pipe/reverse.pipe";
import { TrackLoaderService } from "../track-loader/track-loader.service";
import { HttpClientModule } from "@angular/common/http/";
import { TrackSaverService } from "../track-saver/track-saver.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";

describe("TrackEditorComponent", () => {
  let component: TrackEditorComponent;
  let fixture: ComponentFixture<TrackEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackEditorComponent, ReversePipe ],
      imports: [HttpClientModule],
      providers: [
          TrackLoaderService,
          TrackSaverService,
          {
            provide: ActivatedRoute,
            useValue: {
              params: Observable.of({ })
            }
          },
          {
            provide: Router,
            useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); }
        }
        ]
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
