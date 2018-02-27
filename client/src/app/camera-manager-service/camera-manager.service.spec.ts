import { TestBed, inject } from "@angular/core/testing";

import { CameraManagerService, TargetInfos } from "./camera-manager.service";
import { Vector3 } from "three";
import { CameraType } from "./camera-container";
import { PERS_CAMERA_ANGLE } from "./perspective-camera-container";
import { InputManagerService } from "../input-manager-service/input-manager.service";
import { RAD_TO_DEG } from "../constants";

// tslint:disable:no-magic-numbers

describe("CameraManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CameraManagerService, InputManagerService]
    });
  });

  it("should be created", inject([CameraManagerService], (service: CameraManagerService) => {
    expect(service).toBeTruthy();
  }));

  it("should change camera to the given one",
     inject([CameraManagerService], (manager: CameraManagerService) => {
            manager.cameraType = CameraType.Perspective;
            expect(manager.cameraType).toBe(CameraType.Perspective);
            manager.cameraType = CameraType.Orthographic;
            expect(manager.cameraType).toBe(CameraType.Orthographic);
        })
    );

  it("should switch camera",
     inject([CameraManagerService], (manager: CameraManagerService) => {
            manager.cameraType = CameraType.Perspective;
            manager.switchCamera();
            expect(manager.cameraType).toBe(CameraType.Orthographic);
            manager.switchCamera();
            expect(manager.cameraType).toBe(CameraType.Perspective); // Doing multiple switch to see if come and go works
            manager.switchCamera();
            expect(manager.cameraType).toBe(CameraType.Orthographic);
        })
    );

  it("should zoom in",
     inject([CameraManagerService], (manager: CameraManagerService) => {
        manager.init();
        const cameraDistance: number = manager.cameraDistanceToCar;
        manager.zoomIn();
        manager.update(5);
        expect(manager.cameraDistanceToCar).toBeLessThan(cameraDistance, 0);
  }) );

  it("should zoom out",
     inject([CameraManagerService], (manager: CameraManagerService) => {
        manager.init();
        const cameraDistance: number = manager.cameraDistanceToCar;
        manager.zoomOut();
        manager.update(1);
        expect(manager.cameraDistanceToCar).toBeGreaterThan(cameraDistance);
  }) );
});
