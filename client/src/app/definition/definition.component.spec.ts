import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CrosswordService } from "../crossword-service/crossword.service";
import { DefinitionComponent } from "./definition.component";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { HttpClientModule } from "@angular/common/http";

describe("DefinitionComponent", () => {
    let component: DefinitionComponent;
    let fixture: ComponentFixture<DefinitionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefinitionComponent],
            providers : [CrosswordService, CrosswordCommunicationService],
            imports: [HttpClientModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
    it("cheat mode should switch", () => {
        const pastCheatmodeState: boolean = component.cheatMode;
        component.toogleCheatMode();
        expect(component.cheatMode).toEqual(!pastCheatmodeState);
    });
});
