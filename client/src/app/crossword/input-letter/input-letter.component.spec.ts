import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { InputLetterComponent } from "./input-letter.component";
import { CrosswordService } from "../crossword-service/crossword.service";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { TileColorDirective } from "./tile-color.directive";

describe("InputLetterComponent", () => {
    let component: InputLetterComponent;
    let fixture: ComponentFixture<InputLetterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InputLetterComponent, TileColorDirective],
            providers: [CrosswordService, CrosswordCommunicationService],
            imports: [HttpClientModule]
        })
            .compileComponents().catch((e: Error) => console.error(e.message));
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
