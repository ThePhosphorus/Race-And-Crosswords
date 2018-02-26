import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { InputLetterComponent } from "../input-letter/input-letter.component";
import { InputGridComponent } from "./input-grid.component";
import { CrosswordService } from "../crossword-service/crossword.service";
import { HttpClientModule } from "@angular/common/http";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";

describe("InputGridComponent", () => {
  let component: InputGridComponent;
  let fixture: ComponentFixture<InputGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputGridComponent, InputLetterComponent ],
      providers : [CrosswordService, CrosswordCommunicationService],
      imports: [HttpClientModule],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
