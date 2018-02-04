import { TestBed, inject } from "@angular/core/testing";

import { CrosswordService } from "./crossword.service";

describe("CrosswordService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrosswordService]
    });
  });

  it("should be created", inject([CrosswordService], (service: CrosswordService) => {
    expect(service).toBeTruthy();
  }));
});
