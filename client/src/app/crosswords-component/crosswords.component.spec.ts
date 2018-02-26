import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CrosswordsComponent } from "./crosswords.component";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { PlayermodeComponent } from "../playermode-component/playermode.component";
import { DefinitionComponent } from "../definition/definition.component";
import { InputGridComponent } from "../input-grid/input-grid.component";
import { CrosswordService } from "../crossword-service/crossword.service";
import { HttpClientModule } from "@angular/common/http";

describe("CrosswordsComponent", () => {
  let component: CrosswordsComponent;
  let fixture: ComponentFixture<CrosswordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordsComponent, PlayermodeComponent, InputGridComponent, DefinitionComponent ],
      imports: [HttpClientModule],
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

});
