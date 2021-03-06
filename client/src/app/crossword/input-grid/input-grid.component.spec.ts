import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { InputLetterComponent } from "../input-letter/input-letter.component";
import { InputGridComponent } from "./input-grid.component";
import { CrosswordService } from "../crossword-service/crossword.service";
import { HttpClientModule } from "@angular/common/http";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { TileColorDirective } from "../input-letter/tile-color.directive";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { GameManager } from "../crossword-game-manager/crossword-game-manager";
import { GameInfoService } from "../crossword-game-info/game-info-service/game-info.service";
// tslint:disable:no-magic-numbers

describe("InputGridComponent", () => {
    let component: InputGridComponent;
    let fixture: ComponentFixture<InputGridComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InputGridComponent, InputLetterComponent, TileColorDirective],
            providers: [CrosswordService, CrosswordCommunicationService, GameManager, GameInfoService],
            imports: [HttpClientModule]
        })
            .compileComponents().catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InputGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should receive a promise", inject([CrosswordService], (service: CrosswordService) => {
        service.gameManager.playerGridSubject.subscribe( (grid: CrosswordGrid) => {
          expect(grid).toBeDefined();
        });
    }));

});
