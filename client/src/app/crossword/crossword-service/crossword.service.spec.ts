import { TestBed, inject } from "@angular/core/testing";
import { CrosswordService } from "./crossword.service";
// import { Difficulty, CrosswordGrid, Orientation, Word, Letter } from "../../../../../common/communication/crossword-grid";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { HttpClientModule } from "@angular/common/http/";
// import { GameManager, SolvedWord } from "../crossword-game-manager/crossword-game-manager";

// tslint:disable:no-magic-numbers
describe("CrosswordService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [CrosswordService, CrosswordCommunicationService]
        });
    });

    it("should be created", inject([CrosswordService], (service: CrosswordService) => {
        expect(service).toBeTruthy();
    }));

    // it("should define the listeners of commService",
    //    inject([CrosswordService, CrosswordCommunicationService],
    //           (service: CrosswordService, commService: CrosswordCommunicationService) => {
    //     service.newGame(Difficulty.Easy, false);
    //     expect(commService.listenerIsCompletedFirst).toBeDefined();
    //     expect(commService.listenerReceiveGrid).toBeDefined();
    //     expect(commService.listenerReceivePlayers).toBeDefined();
    //     expect(commService.listenerReceiveSelect).toBeDefined();
    //     expect(commService.listenerReceiveUpdatedWord).toBeDefined();
    // }));

    // it("should select a word", inject([CrosswordService], (service: CrosswordService) => {
    //     service.newGame(Difficulty.Easy, false);
    //     const index: number = 0;
    //     const pastLength: number = service.gridStateObs.getValue.length;
    //     service.setSelectedLetter(index);
    //     expect( service.gridStateObs.getValue.length).toBeGreaterThanOrEqual(pastLength);

    // }));

    // it("should select a word", inject([CrosswordService], (service: CrosswordService) => {
    //     service.newGame(Difficulty.Easy, false);
    //     const word: Word = new Word();
    //     const pastLength: number = service.gridStateObs.getValue.length;
    //     service.setHoveredWord(word);
    //     expect( service.gridStateObs.getValue.length).toBeGreaterThanOrEqual(pastLength);

    // }));
});
