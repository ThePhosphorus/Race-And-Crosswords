import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ModalNewGameComponent } from "./modal-new-game.component";
import { InWaitMatch } from "../../../../../../common/communication/Match";
import { Difficulty } from "../../../../../../common/crossword/enums-constants";
import { FormsModule } from "@angular/forms";
import { CrosswordService } from "../../crossword-service/crossword.service";
import { CrosswordCommunicationService } from "../../crossword-communication-service/crossword.communication.service";
import { HttpClientModule } from "@angular/common/http";
import { GameInfoService } from "../game-info.service";

describe("ModalNewGameComponent", () => {
    let component: ModalNewGameComponent;
    let fixture: ComponentFixture<ModalNewGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, HttpClientModule],
            providers: [CrosswordService, CrosswordCommunicationService, GameInfoService],
            declarations: [ ModalNewGameComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalNewGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should show the level Choice", () => {
        component.isCollapsedAvailablePlayer = false;
        component.showLevelChoice(true);
        expect(component.showLevelGame).toBeTruthy();
        expect(component.isCollapsedAvailablePlayer).not.toBeTruthy();
        component.showLevelChoice(false);
        expect(component.isCollapsedAvailablePlayer).toBeTruthy();
        expect(component.showLevelGame).not.toBeTruthy();
    });

    it("should join the right player", () => {
        const match: InWaitMatch = new InWaitMatch("Alpha", Difficulty.Medium);
        component.joinMatch(match);
        expect(component.joinedPlayer).toBe(match.name);
        expect(component.lvl).toBe(match.difficulty);
    });

    it("should compare to the level right", () => {
        component.lvl = Difficulty.Medium;
        expect(component.isDiff(Difficulty.Easy)).toBeFalsy();
        expect(component.isDiff(Difficulty.Medium)).toBeTruthy();
        expect(component.isDiff(Difficulty.Hard)).toBeFalsy();
    });
});
