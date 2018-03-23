import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ModalNewGameComponent } from "./modal-new-game.component";
import { Difficulty } from "../../../../../../common/communication/crossword-grid";

describe("ModalNewGameComponent", () => {
  let component: ModalNewGameComponent;
  let fixture: ComponentFixture<ModalNewGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should change level", () => {
    const diff: Difficulty = Difficulty.Easy;
    component.changeLevel(diff);
    expect(component.lvl).toBe(diff);
});
it("should receive a promise", inject([CrosswordCommunicationService], (service: CrosswordCommunicationService) => {
    this._crosswordService.newGame(this._lvl, this.isSinglePlayer);
    service.grid.subscribe( (grid: CrosswordGrid) => {
      expect(grid).toBeDefined();
    });
}));
});
