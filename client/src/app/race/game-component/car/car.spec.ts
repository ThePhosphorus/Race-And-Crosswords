import { Engine } from "./engine";
import { Vector3, Vector2 } from "three";
import { Car } from "./car";
import { TestBed, inject } from "@angular/core/testing";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";

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

    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({providers: [CameraManagerService]});
        car = new Car(TestBed.get(CameraManagerService), new MockEngine());
        await car.init(CAR_DEFAULT_POSITION, "yellow");

        car.update(MS_BETWEEN_FRAMES);
        done();
    });

    it("should be instantiable using default constructor", inject([CameraManagerService], (cameraManager: CameraManagerService) => {
        car = new Car(cameraManager, new MockEngine());
        expect(car).toBeDefined();
        expect(car.speed).toBe(0);
    }));

    it("should accelerate when accelerator is pressed", () => {
        const initialSpeed: number = car.speed;
        car.carControl.accelerate();
        car.update(MS_BETWEEN_FRAMES);
        expect(car.speed).toBeGreaterThan(initialSpeed);
    });

    it("should decelerate when brake is pressed", () => {
        // Remove rolling resistance and drag force so the only force slowing down the car is the brakes.
        car["getRollingResistance"] = () => {
            return new Vector2(0, 0);
        };

        car["getDragForce"] = () => {
            return new Vector2(0, 0);
        };

        car.carControl.accelerate();
        car.update(MS_BETWEEN_FRAMES);
        car.carControl.releaseAccelerator();

        const initialSpeed: number = car.speed;
        car.carControl.brake();
        car.update(MS_BETWEEN_FRAMES);
        expect(car.speed).toBeLessThan(initialSpeed);
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

    it("should use default engine parameter when none is provided",
       inject([CameraManagerService], (cameraManager: CameraManagerService) =>  {
            car = new Car(cameraManager);
            expect(car["engine"]).toBeDefined();
    }));
});
