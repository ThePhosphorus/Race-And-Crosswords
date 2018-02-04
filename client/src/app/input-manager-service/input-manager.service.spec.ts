import { TestBed, inject } from "@angular/core/testing";

import { InputManagerService } from "./input-manager.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";

describe("InputManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputManagerService, CameraManagerService]
    });
  });

  it("should be created", inject([InputManagerService], (service: InputManagerService) => {
    expect(service).toBeTruthy();
  }));
});
