import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CrosswordsComponent } from "./crosswords.component";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { PlayermodeComponent } from "../playermode-component/playermode.component";

describe("CrosswordsComponent", () => {
  let component: CrosswordsComponent;
  let fixture: ComponentFixture<CrosswordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordsComponent, PlayermodeComponent ],
      providers: [ CrosswordCommunicationService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("cheat mode should switch", () => {
      const pastCheatmodeState: boolean = component.cheatMode;
      component.toogleCheatMode();
      expect(component.cheatMode).toEqual(!pastCheatmodeState);
  });
});
