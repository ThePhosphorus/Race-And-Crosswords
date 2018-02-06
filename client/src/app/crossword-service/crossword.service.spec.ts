import { TestBed, inject } from "@angular/core/testing";

import { CrosswordService } from "./crossword.service";
import { Difficulty, CrosswordGrid } from "../../../../common/communication/crossword-grid";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { HttpClientModule } from "@angular/common/http/";

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

  it("should recieve a promise", inject([CrosswordService], (service: CrosswordService) => {
      service.newGame(Difficulty.Easy, 4, 0.3).subscribe( (grid: CrosswordGrid) => {
        expect(grid).toBeDefined();
      });
  }));
});
