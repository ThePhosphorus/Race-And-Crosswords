import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ModalNewGameComponent } from "./modal-new-game.component";
import { Difficulty } from "../../../../../../common/crossword/enums-constants";
import { FormsModule } from "@angular/forms";
import { CrosswordService } from "../../crossword-service/crossword.service";
import { CrosswordCommunicationService } from "../../crossword-communication-service/crossword.communication.service";
import { HttpClientModule } from "@angular/common/http";
import { GameInfoService } from "../game-info-service/game-info.service";
import { InWaitMatch } from "../../../../../../common/communication/Match";

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

    it("should chooseMode singlePlayer", () => {
        const isSinglePlayer: boolean = true;
        component.chooseMode(isSinglePlayer);
        expect(component.isSinglePlayer).toBeTruthy();
    });
    it("should show level if true", () => {
        const isShowLevel: boolean = true;
        component.showLevelChoice(isShowLevel);
        expect(component.showLevelGame).toBeTruthy();
    });
    it("should joinMatch", () => {
        const match: InWaitMatch = new InWaitMatch("test", Difficulty.Easy);
        component.joinMatch(match);
        expect(component.joinedPlayer).toBe(match.name);
        expect(component.level).toBe(match.difficulty);
    });

});
