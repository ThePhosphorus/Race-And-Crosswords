import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { InputLetterComponent } from "./input-letter.component";
import { CrosswordService } from "../crossword-service/crossword.service";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { PlayerId } from "../../../../../common/communication/Player";

describe("InputLetterComponent", () => {
    let component: InputLetterComponent;
    let fixture: ComponentFixture<InputLetterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InputLetterComponent],
            providers: [CrosswordService, CrosswordCommunicationService],
            imports: [HttpClientModule]
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
    it("players should have different backgroundcolor", () => {
        expect(component.getBGPlayerColor(PlayerId.PLAYER1)).not.toBe(component.getBGPlayerColor(PlayerId.PLAYER2));
    });
    it("players should have different color", () => {
        expect(component.getPlayerColor(PlayerId.PLAYER1)).not.toBe(component.getPlayerColor(PlayerId.PLAYER2));
    });
});
