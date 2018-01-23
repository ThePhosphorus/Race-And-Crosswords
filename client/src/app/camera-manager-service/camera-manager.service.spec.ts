import { TestBed, inject } from "@angular/core/testing";

import { CameraManagerService, CameraType } from "./camera-manager.service";
import { Vector3 } from "three";

describe("CameraManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CameraManagerService]
    });
  });

  it("should be created", inject([CameraManagerService], (service: CameraManagerService) => {
    expect(service).toBeTruthy();
  }));

  it("should change camera to Perspective",
     inject([CameraManagerService], (manager: CameraManagerService) => {
            manager.cameraType = CameraType.Persp;
            expect(manager.cameraType).toBe(CameraType.Persp);
            manager.cameraType = CameraType.Ortho;
            expect(manager.cameraType).toBe(CameraType.Ortho);
        })
    );

  it("should switch camera",
     inject([CameraManagerService], (manager: CameraManagerService) => {
            manager.cameraType = CameraType.Persp;
            manager.switchCamera();
            expect(manager.cameraType).toBe(CameraType.Ortho);
            manager.switchCamera();
            expect(manager.cameraType).toBe(CameraType.Persp); // Doing multiple switch to see if come and go works
            manager.switchCamera();
            expect(manager.cameraType).toBe(CameraType.Ortho);
        })
    );

  it("should be at distance distance of the car",
     inject([CameraManagerService], (manager: CameraManagerService) => {
        manager.updatecarInfos(new Vector3(10, 0, 25), new Vector3(1, 1, 1));
        manager.cameraDistanceToCar = 25;
        manager.init();
        manager.update(5);
        expect(manager.position.distanceTo(new Vector3(10, 0, 25))).toBeCloseTo(manager.cameraDistanceToCar, 0);
  }) );

  it("should zoom in",
     inject([CameraManagerService], (manager: CameraManagerService) => {
        manager.init();
        const cameraDistance: number = manager.cameraDistanceToCar;
        manager.zoomFactor = 1;
        manager.update(5);
        expect(manager.cameraDistanceToCar).toBeLessThan(cameraDistance, 0);
  }) );

  it("should zoom out",
     inject([CameraManagerService], (manager: CameraManagerService) => {
        manager.init();
        const cameraDistance: number = manager.cameraDistanceToCar;
        manager.zoomFactor = -1;
        manager.update(5);
        expect(manager.cameraDistanceToCar).toBeGreaterThan(cameraDistance, 0);
  }) );

});
