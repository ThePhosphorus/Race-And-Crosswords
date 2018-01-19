import { TestBed, inject } from "@angular/core/testing";
import { RenderService, CameraType } from "./render.service";

describe("RenderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService]
        });
    });

    it(
        "should be created",
        inject([RenderService], (service: RenderService) => {
            expect(service).toBeTruthy();
        })
    );

    it(
        "should change camera to Perspective",
        inject([RenderService], (service: RenderService) => {
            service.CameraType = CameraType.Pers;
            expect(service.CameraType).toBe(CameraType.Pers);
            service.CameraType = CameraType.Ortho;
            expect(service.CameraType).toBe(CameraType.Ortho);
        })
    );

    it(
        "should switch camera",
        inject([RenderService], (service: RenderService) => {
            service.CameraType = CameraType.Pers;
            service.switchCamera();
            expect(service.CameraType).toBe(CameraType.Ortho);
            service.switchCamera();
            expect(service.CameraType).toBe(CameraType.Pers); // Doing multiple switch to see if come and go works
            service.switchCamera();
            expect(service.CameraType).toBe(CameraType.Ortho);
        })
    );
});
