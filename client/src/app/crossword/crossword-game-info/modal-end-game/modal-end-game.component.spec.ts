import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ModalEndGameComponent } from "./modal-end-game.component";
import { CrosswordService } from "../../crossword-service/crossword.service";
import { CrosswordCommunicationService } from "../../crossword-communication-service/crossword.communication.service";
import { HttpClientModule } from "@angular/common/http";
import { GameInfoService } from "../game-info-service/game-info.service";

describe("ModalEndGameComponent", () => {
    let component: ModalEndGameComponent;
    let fixture: ComponentFixture<ModalEndGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [ModalEndGameComponent],
            providers: [CrosswordService, CrosswordCommunicationService, GameInfoService]
        })
            .compileComponents().catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalEndGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should put disconnect at false when configure", () => {
        component.configureGame();
        expect(component.isDisconnected).toBe(false);
    });

});
