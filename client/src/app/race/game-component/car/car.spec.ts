import { Engine } from "./engine";
import { Vector3 } from "three";
import { Car } from "./car";
import { TestBed, inject } from "@angular/core/testing";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { LoaderService } from "../loader-service/loader.service";
import { LoadedObject } from "../loader-service/load-types.enum";

const MS_BETWEEN_FRAMES: number = 16.6667;
const CAR_DEFAULT_POSITION: Vector3 = new Vector3(0, 0, 0);

/* tslint:disable: no-magic-numbers */
class MockEngine extends Engine {
    public getDriveTorque(): number {
        return 10000;
    }
}

describe("Car", () => {
    let car: Car;

    beforeEach(() => {
        TestBed.configureTestingModule({providers: [CameraManagerService, LoaderService]});
        car = new Car( new MockEngine());
        car.init(
            CAR_DEFAULT_POSITION, TestBed.get(LoaderService), LoadedObject.carYellow, TestBed.get(CameraManagerService).audioListener, );

        car.update(MS_BETWEEN_FRAMES);
    });

    it("should be instantiable using default constructor", inject([CameraManagerService], (cameraManager: CameraManagerService) => {
        car = new Car(new MockEngine());
        expect(car).toBeDefined();
        expect(car.speed).toBe(0);
    }));

    it("should accelerate when accelerator is pressed", () => {
        const initialSpeed: number = car.speed;
        car.carControl.accelerate();
        car.update(MS_BETWEEN_FRAMES);
        expect(car.speed).toBeGreaterThan(initialSpeed);
    });

    it("should decelerate without brakes", () => {
        car.carControl.accelerate();
        car.update(MS_BETWEEN_FRAMES);
        car.carControl.releaseAccelerator();

        const initialSpeed: number = car.speed;
        car.carControl.brake();
        car.update(MS_BETWEEN_FRAMES);
        expect(car.speed).toBeLessThan(initialSpeed);
    });

    it("should not turn when steering keys are released", () => {
        const initialDirection: Vector3 = car.direction.clone();
        car.carControl.accelerate();
        car.update(MS_BETWEEN_FRAMES * 2);
        expect(car.direction.equals(initialDirection)).toBeTruthy();
    });
});
