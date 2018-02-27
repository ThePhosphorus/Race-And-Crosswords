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
    it("should switch cheat mode", () => {
        const pastCheatmodeState: boolean = component.cheatMode;
        component.toogleCheatMode();
        expect(component.cheatMode).toEqual(!pastCheatmodeState);
    });

    it("should upperfirst the first Letter", () => {
        const strLowerFirst: string = "hello";
        const strUpperFirst: string = "Allo";
        const firstLetterLower: string = strLowerFirst.substr(0, 1);
        const firstLetterUpper: string = strUpperFirst.substr(0, 1);

        // Check if it's the same string
        expect(component.upperFirstLetter(strLowerFirst).toLowerCase()).toBe(strLowerFirst.toLowerCase());
        expect(component.upperFirstLetter(strUpperFirst).toLowerCase()).toBe(strUpperFirst.toLowerCase());

        // Check if the first letter is uppercase
        expect(component.upperFirstLetter(strLowerFirst).substr(0, 1)).toBe(firstLetterLower.toUpperCase());
        expect(component.upperFirstLetter(strUpperFirst).substr(0, 1)).toBe(firstLetterUpper.toUpperCase());
    });
});
