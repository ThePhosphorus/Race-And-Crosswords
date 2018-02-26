import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { InputLetterComponent } from "./input-letter.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CrosswordService } from "../crossword-service/crossword.service";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";

describe("InputLetterComponent", () => {
    let component: InputLetterComponent;
    let fixture: ComponentFixture<InputLetterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InputLetterComponent],
            providers: [CrosswordService, CrosswordCommunicationService],
            imports: [HttpClientModule],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InputLetterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
