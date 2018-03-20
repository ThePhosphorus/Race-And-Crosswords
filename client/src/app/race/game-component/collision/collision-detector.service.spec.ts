import { TestBed, inject } from "@angular/core/testing";

import { CollisionDetectorService } from "./collision-detector.service";

describe("CollisionDetectorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollisionDetectorService]
    });
  });

  it("should be created", inject([CollisionDetectorService], (service: CollisionDetectorService) => {
    expect(service).toBeTruthy();
  }));
});
