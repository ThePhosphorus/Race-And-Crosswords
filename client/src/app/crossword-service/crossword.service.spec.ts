import { TestBed, inject } from "@angular/core/testing";

import { CrosswordService } from "./crossword.service";
import { Difficulty, CrosswordGrid } from "../../../../common/communication/crossword-grid";

describe("CrosswordService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrosswordService]
    });
  });

  it("should be created", inject([CrosswordService], (service: CrosswordService) => {
    expect(service).toBeTruthy();
  }));

  it("should recieve a promise", inject([CrosswordService], (service: CrosswordService) => {
      service.newGame(Difficulty.Easy, 4, 0.3).subscribe( (grid: CrosswordGrid) => {
        expect(grid).toBeDefined();
      });
  }));
});
