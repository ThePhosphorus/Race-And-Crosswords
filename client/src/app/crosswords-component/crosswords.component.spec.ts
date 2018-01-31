import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CrosswordsComponent } from "./crosswords.component";
import { PlayermodeComponent } from "../playermode-component/playermode.component";

describe("CrosswordsComponent", () => {
  let component: CrosswordsComponent;
  let fixture: ComponentFixture<CrosswordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordsComponent, PlayermodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
