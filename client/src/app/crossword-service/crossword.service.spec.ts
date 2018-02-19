import { TestBed, inject } from "@angular/core/testing";

import { CrosswordService } from "./crossword.service";
import { Difficulty, CrosswordGrid } from "../../../../common/communication/crossword-grid";
import { CrosswordCommunicationService } from "../crossword-communication-service/crossword.communication.service";
import { HttpClientModule } from "@angular/common/http/";

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
      service.newGame(Difficulty.Hard, 0.3, 2).toPromise().then( (grid: CrosswordGrid) => {
        expect(grid).toBeDefined();
      }).catch( (e) => console.error(e) );
  }));
});
