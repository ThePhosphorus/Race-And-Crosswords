import { TestBed, inject } from "@angular/core/testing";

import { TrackPreviewService } from "./track-preview.service";

describe("TrackPreviewService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackPreviewService]
    });
  });

  it("should be created", inject([TrackPreviewService], (service: TrackPreviewService) => {
    expect(service).toBeTruthy();
  }));
});
