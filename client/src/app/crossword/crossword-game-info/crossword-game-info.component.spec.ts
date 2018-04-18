import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { CrosswordGameInfoComponent } from "./crossword-game-info.component";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { CrosswordService } from "../crossword-service/crossword.service";
import { Player } from "../../../../../common/communication/Player";
import { Difficulty } from "../../../../../common/crossword/enums-constants";
import { ModalNewGameComponent } from "./modal-new-game/modal-new-game.component";
import { FormsModule } from "@angular/forms";
import { GameInfoService } from "./game-info-service/game-info.service";
import { ModalEndGameComponent } from "./modal-end-game/modal-end-game.component";

describe("CrosswordGameInfoComponent", () => {
    let component: CrosswordGameInfoComponent;
    let fixture: ComponentFixture<CrosswordGameInfoComponent>;
    let crosswordService: CrosswordService;
    let gameInfoService: GameInfoService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, FormsModule],
            declarations: [CrosswordGameInfoComponent, ModalEndGameComponent, ModalNewGameComponent],
            providers: [CrosswordCommunicationService, CrosswordService, GameInfoService]
        })
            .compileComponents().catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrosswordGameInfoComponent);
        component = fixture.componentInstance;
        crosswordService = TestBed.get(CrosswordService);
        gameInfoService = TestBed.get(GameInfoService);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should receive a promise for Difficulty", () => {
        gameInfoService.lvl.subscribe( (difficulty: Difficulty) => {
          expect(difficulty).toBeDefined();
        });
    });

    it("should receive a promise for players", () => {
        crosswordService.gameManager.playersSubject.subscribe( (players: Array<Player>) => {
          expect(players).toBeDefined();
        });
    });

});
