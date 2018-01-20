import { TestBed, inject } from "@angular/core/testing";

import { CameraManagerService } from "./camera-manager.service";

describe("CameraManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CameraManagerService]
    });
  });

  it("should be created", inject([CameraManagerService], (service: CameraManagerService) => {
    expect(service).toBeTruthy();
  }));
});
