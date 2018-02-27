import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { InputLetterComponent } from "../input-letter/input-letter.component";
import { InputGridComponent } from "./input-grid.component";
import { CrosswordService } from "../crossword-service/crossword.service";
import { HttpClientModule } from "@angular/common/http";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { CrosswordGrid } from "../../../../common/communication/crossword-grid";
import { MOCK } from "../mock-crossword/mock-crossword";

describe("InputGridComponent", () => {
    let component: InputGridComponent;
    let fixture: ComponentFixture<InputGridComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InputGridComponent, InputLetterComponent],
            providers: [CrosswordService, CrosswordCommunicationService],
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
    it("grid only accepts letters", () => {
        const numberEntered: KeyboardEvent = new KeyboardEvent("keypress", { "key": "1" });
        const pastCurrentLetter: number = component.currentLetter;
        component.writeChar(numberEntered);
        expect(component.currentLetter).toBe(pastCurrentLetter);
    });

    it("should relink crossword Grid when using relinkLetters", () => {
        // import mockGrid
        const grid: CrosswordGrid = MOCK;
        component.relinkLetters(grid);

        // change a letter in a grid
        const letterId: number = grid.words[0].letters[0].id;
        const newLetter: string = "C";
        grid.grid[letterId].char = newLetter;

        expect(grid.words[0].letters[0].char).toBe(newLetter);

  });

});
