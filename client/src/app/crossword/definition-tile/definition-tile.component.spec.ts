import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { DefinitionTileComponent } from "./definition-tile.component";
import { CrosswordService } from "../crossword-service/crossword.service";
import { DisplayedDefinition } from "../definition/definition.component";
import { Orientation } from "../../../../../common/crossword/enums-constants";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { HttpClientModule } from "@angular/common/http";
import { By } from "@angular/platform-browser";

describe("DefinitionTileComponent", () => {
    let component: DefinitionTileComponent;
    let fixture: ComponentFixture<DefinitionTileComponent>;
    let service: CrosswordService;
    const item: DisplayedDefinition = new DisplayedDefinition("best team", "salads", 0, 0, Orientation.Across);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefinitionTileComponent],
            providers: [CrosswordService, CrosswordCommunicationService],
            imports: [HttpClientModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionTileComponent);
        component = fixture.componentInstance;
        component.item = item;
        component.cheatmode = false;
        service = TestBed.get(CrosswordService);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should show the definition", () => {
        expect(fixture.debugElement.query(By.css("p")).nativeElement.textContent).toContain(item.definition);
    });

    it("should highlight grid tiles on hover", () => {
        spyOn(service, "setHoveredWord");
        component.hover();
        expect(service.setHoveredWord).toHaveBeenCalled();
    });

    it("should unhighlight grid tiles on unhover", () => {
        spyOn(service, "setHoveredWord");
        component.unHover();
        expect(service.setHoveredWord).toHaveBeenCalled();
    });

    it("should select grid tiles on click", () => {
        spyOn(service, "setSelectedWord");
        component.select(new MouseEvent(""));
        expect(service.setSelectedWord).toHaveBeenCalled();
    });

    it("should disable if the word is solved", () => {
        spyOn(service.gameManager, "isWordSolved").and.returnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css(".disabled"))).not.toBeNull();
    });

    it("should show the word if the cheatmode is on", () => {
        component.cheatmode = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css("p")).nativeElement.textContent).toContain(item.word);
    });
});
