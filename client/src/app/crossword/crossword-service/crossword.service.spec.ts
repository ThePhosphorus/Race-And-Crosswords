import { TestBed, inject, async } from "@angular/core/testing";
import { CrosswordService } from "./crossword.service";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { HttpClientModule } from "@angular/common/http/";
import { Difficulty } from "../../../../../common/crossword/enums-constants";

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

  it("should receive a promise", inject([CrosswordService], (service: CrosswordService) => {
      service.newGame(Difficulty.Easy, 4, 0.3);
      service.grid.subscribe( (grid: CrosswordGrid) => {
        expect(grid).toBeDefined();
      });
  }));

  it("should add a solved word", async(inject([CrosswordService], (service: CrosswordService) => {
        service.solvedWords.subscribe((words: number[]) => {
            const pastLength: number = words.length;
            const newNumber: number = 20;
            service.addSolvedWord(newNumber);
            service.solvedWords.subscribe((newWords: number[]) => {
                expect(newWords.length).toBe(pastLength + 1 );
                expect(newWords[newWords.length - 1]).toBe(newNumber);
            });
        });
  })));
});
