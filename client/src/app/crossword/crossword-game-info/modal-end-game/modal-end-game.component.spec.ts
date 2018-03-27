import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ModalEndGameComponent } from "./modal-end-game.component";
import { CrosswordService } from "../../crossword-service/crossword.service";
import { CrosswordCommunicationService } from "../../crossword-communication-service/crossword.communication.service";
import { HttpClientModule } from "@angular/common/http";

describe("ModalEndGameComponent", () => {
  let component: ModalEndGameComponent;
  let fixture: ComponentFixture<ModalEndGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule],
        declarations: [ ModalEndGameComponent ],
        providers: [ CrosswordService, CrosswordCommunicationService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEndGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should join the right player", () => {
    const match: InWaitMatch = new InWaitMatch("Alpha", Difficulty.Medium);
    component.joinMatch(match);
    expect(component.joinedPlayer).toBe(match.name);
    expect(component.level).toBe(match.difficulty);
});
});
