import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { CrosswordGameInfoComponent } from "./crossword-game-info.component";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Difficulty } from '../../../../common/communication/crossword-grid';

describe("CrosswordGameInfoComponent", () => {
    let component: CrosswordGameInfoComponent;
    let fixture: ComponentFixture<CrosswordGameInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [CrosswordGameInfoComponent],
            providers: [CrosswordCommunicationService, CrosswordService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrosswordGameInfoComponent);
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
});
