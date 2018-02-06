import { TestBed, inject } from "@angular/core/testing";

import { TrackGeneratorService } from "./track.generator.service";

describe("TrackGeneratorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackGeneratorService]
    });
  });

  it("should be created", inject([TrackGeneratorService], (service: TrackGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
