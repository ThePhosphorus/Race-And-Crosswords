import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { CrosswordGameInfoComponent } from "./crossword-game-info.component";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Player } from "../../../../../common/communication/Player";
import { Difficulty } from "../../../../../common/crossword/enums-constants";
import { ModalNewGameComponent } from "./modal-new-game/modal-new-game.component";
import { FormsModule } from "@angular/forms";

describe("CrosswordGameInfoComponent", () => {
    let component: CrosswordGameInfoComponent;
    let fixture: ComponentFixture<CrosswordGameInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, FormsModule],
            declarations: [CrosswordGameInfoComponent, ModalNewGameComponent],
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

    it("should receive a promise", inject([CrosswordService], (service: CrosswordService) => {
        service.difficulty.subscribe( (difficulty: Difficulty) => {
          expect(difficulty).toBeDefined();
        });
    }));

    it("should receive a promise", inject([CrosswordService], (service: CrosswordService) => {
        service.players.subscribe( (players: Array<Player>) => {
          expect(players).toBeDefined();
        });
    }));

});
