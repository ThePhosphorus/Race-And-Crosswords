import { TestBed, inject } from "@angular/core/testing";
import { CrosswordService } from "./crossword.service";
import { GameManager } from "../crossword-game-manager/crossword-game-manager";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { HttpClientModule } from "@angular/common/http/";
import { Difficulty, Orientation } from "../../../../../common/crossword/enums-constants";
import { Word } from "../../../../../common/crossword/word";
import { Letter } from "../../../../../common/crossword/letter";

// tslint:disable:no-magic-numbers
describe("CrosswordService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [CrosswordService, CrosswordCommunicationService, GameManager]
        });
    });

    it("should be created", inject([CrosswordService], (service: CrosswordService) => {
        expect(service).toBeTruthy();
    }));

    it("should select a word", inject([CrosswordService], (service: CrosswordService) => {
        service.newGame(Difficulty.Easy, false);
        const word: Word = new Word();
        word.id = 0;
        word.orientation = Orientation.Across;
        word.letters = [new Letter("", 0), new Letter("", 1), new Letter("", 2), new Letter("", 3), new Letter("", 4)];

        service.gameManager.playerGridObs.getValue().words.push(word);

        const index: number = 0; // tile 0 shoud be at a crossroad
        service.setSelectedLetter(index);

        expect(service.gridStateObs.getValue().LIsSelected(index)).toBeTruthy();

        service.unselectWord();
        expect(service.gridStateObs.getValue().LIsSelected(index)).toBeFalsy();
    }));

    it("should Hover a word", inject([CrosswordService], (service: CrosswordService) => {
        service.newGame(Difficulty.Easy, false);
        const word: Word = new Word();
        word.id = 0;
        word.orientation = Orientation.Across;
        word.letters = [new Letter("", 0), new Letter("", 1), new Letter("", 2), new Letter("", 4), new Letter("", 3)];

        service.setHoveredWord(word.id, word.orientation);
        word.letters.forEach((l: Letter) => expect(service.gridStateObs.getValue().LIsHovered(l.id)));
    }));
});
