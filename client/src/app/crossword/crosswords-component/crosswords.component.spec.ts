import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InputLetterComponent } from "../input-letter/input-letter.component";
import { CrosswordsComponent } from "./crosswords.component";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { CrosswordGameInfoComponent } from "../crossword-game-info/crossword-game-info.component";
import { DefinitionComponent } from "../definition/definition.component";
import { InputGridComponent } from "../input-grid/input-grid.component";
import { CrosswordService } from "../crossword-service/crossword.service";
import { HttpClientModule } from "@angular/common/http";
import { ModalNewGameComponent } from "../crossword-game-info/modal-new-game/modal-new-game.component";
import { TileColorDirective } from "../input-letter/tile-color.directive";
import { FormsModule } from "@angular/forms";

describe("CrosswordsComponent", () => {
  let component: CrosswordsComponent;
  let fixture: ComponentFixture<CrosswordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordsComponent, CrosswordGameInfoComponent,
                      InputGridComponent, InputLetterComponent,
                      DefinitionComponent, ModalNewGameComponent, TileColorDirective],
      imports: [HttpClientModule, FormsModule],
      providers: [ CrosswordCommunicationService, CrosswordService ]
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
  it("loading should be true on init", () => {
    expect(component.loading).toBeTruthy();
  });

});
