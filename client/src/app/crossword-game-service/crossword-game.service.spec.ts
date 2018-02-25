import { TestBed, inject } from "@angular/core/testing";

import { CrosswordGameService } from "./crossword-game.service";

describe("CrosswordGameService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CrosswordGameService]
        });
    });

    it("should be created", inject([CrosswordGameService], (service: CrosswordGameService) => {
        expect(service).toBeTruthy();
    }));

    it("should be able to get add words", inject([CrosswordGameService], (service: CrosswordGameService) => {
        let solvedWords: number[] = [];
        const expected: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        service.solvedWords.subscribe((words: number[]) => solvedWords = words);
        expected.forEach((index: number) => {
            service.addSolvedWord(index);
        });
        expect(solvedWords).toBeTruthy();
    }));
});
