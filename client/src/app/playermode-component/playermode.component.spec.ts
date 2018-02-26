import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { PlayermodeComponent } from "./playermode.component";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { CrosswordService } from "../crossword-service/crossword.service";

describe("PlayermodeComponent", () => {
    let component: PlayermodeComponent;
    let fixture: ComponentFixture<PlayermodeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [PlayermodeComponent],
            providers: [CrosswordCommunicationService, CrosswordService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayermodeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
