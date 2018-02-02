import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CrosswordCheatComponent } from "./crossword-cheat.component";

describe("CrosswordCheatComponent", () => {
  let component: CrosswordCheatComponent;
  let fixture: ComponentFixture<CrosswordCheatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordCheatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordCheatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
