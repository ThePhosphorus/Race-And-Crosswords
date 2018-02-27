import { TestBed, inject } from "@angular/core/testing";

import { CameraManagerService, TargetInfos } from "./camera-manager.service";
import { CameraType, RAD_TO_DEG } from "../../global-constants/constants";
import { InputManagerService } from "../input-manager-service/input-manager.service";
import { ZoomLimit } from "./camera-container";
import { Vector3 } from "three";
import { PERS_CAMERA_ANGLE } from "../race.constants";

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

  it("should be at the right distance from the Target using zommLimits", inject([CameraManagerService], (manager: CameraManagerService) => {
      manager.cameraType = CameraType.Perspective;
      const zoomLimit: ZoomLimit = new ZoomLimit(2, 200);
      manager.zoomLimit = zoomLimit;

      manager.zoomIn();
      for (let i: number = 0 ; i < 10000; i++ ) {
          manager.update(0.16); // wait 10000 frames to zoom in
      }
      manager.zoomRelease();

      expect(manager.cameraDistanceToCar).toBeCloseTo(zoomLimit.min, 1);

      manager.zoomOut();
      for (let i: number = 0 ; i < 10000; i++ ) {
        manager.update(0.16); // wait 10000 to zoom out
    }
      manager.zoomRelease();

      expect(manager.cameraDistanceToCar).toBeCloseTo(zoomLimit.max, 1);
  }));

  it("should be at the right angle", inject([CameraManagerService], (manager: CameraManagerService) => {
      const target: TargetInfos = new TargetInfos(new Vector3(10, 0, 10), new Vector3(1, 0, 0));
      manager.cameraType = CameraType.Perspective;
      manager.updateTargetInfos(target);

      manager.update(10);
      expect(target.position.clone().sub(manager.position).angleTo(target.direction) * RAD_TO_DEG).toBeCloseTo(PERS_CAMERA_ANGLE, 1);
  }));
});
