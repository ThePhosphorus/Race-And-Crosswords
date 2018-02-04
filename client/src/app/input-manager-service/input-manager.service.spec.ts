import { TestBed, inject } from "@angular/core/testing";

import { InputManagerService } from "./input-manager.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { RenderService } from "../render-service/render.service";

describe("InputManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputManagerService, CameraManagerService, RenderService]
    });
  });

  it("should be created", inject([InputManagerService], (service: InputManagerService) => {
    expect(service).toBeTruthy();
  }));
});
