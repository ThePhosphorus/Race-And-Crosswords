import { TestBed, inject } from "@angular/core/testing";
import { GameManager } from "./crossword-game-manager";

// tslint:disable:no-magic-numbers
describe("CrosswordGameManager", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameManager]
        });
    });

    it("should be created", inject([GameManager], (service: GameManager) => {
        expect(service).toBeTruthy();
    }));
});
