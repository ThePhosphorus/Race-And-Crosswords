import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { CrosswordService } from "../crossword-service/crossword.service";
import { DefinitionComponent, DisplayedDefinition } from "./definition.component";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { HttpClientModule } from "@angular/common/http";
import { Word } from "../../../../../common/crossword/word";
import { Letter } from "../../../../../common/crossword/letter";
import { Orientation } from "../../../../../common/crossword/enums-constants";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { DefinitionTileComponent } from "../definition-tile/definition-tile.component";

// tslint:disable:no-magic-numbers

describe("DefinitionComponent", () => {
    let component: DefinitionComponent;
    let fixture: ComponentFixture<DefinitionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefinitionComponent, DefinitionTileComponent],
            providers: [CrosswordService, CrosswordCommunicationService],
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

    it("should switch cheat mode", () => {
        const pastCheatmodeState: boolean = component.cheatMode;
        component.toogleCheatMode();
        expect(component.cheatMode).toEqual(!pastCheatmodeState);
    });

    it("should create a Display definition right", () => {
        const word: Word = new Word();
        word.id = 0;
        word.definitions = ["n\tdef0", "n\tDef1"];
        word.letters = [new Letter("W", 0), new Letter("o", 1), new Letter("r", 2), new Letter("d", 3)];
        word.orientation = Orientation.Across;

        const displayDef: DisplayedDefinition = component.wordToDefinition(word);

        expect(displayDef.id).toBe(word.id);
        expect(displayDef.word).toBe(word.toString());
        expect(displayDef.definition).toBe("Def0");
    });

    it("should receive a promise", inject([CrosswordService], (service: CrosswordService) => {
        service.gameManager.playerGridSubject.subscribe((grid: CrosswordGrid) => {
            expect(grid).toBeDefined();
        });
    }));
});
