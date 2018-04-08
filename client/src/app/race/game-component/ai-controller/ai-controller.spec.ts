import { Car } from "../car/car";
import { AIController } from "./ai-controller";
import { TestBed } from "@angular/core/testing";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { Engine } from "../car/engine";
import { Vector3 } from "three";

/* tslint:disable: no-magic-numbers */
const MS_BETWEEN_FRAMES: number = 15;
const CAR_DEFAULT_POSITION: Vector3 = new Vector3(0, 0, 0);
const track: Array<Vector3> = [new Vector3(0, 0, 0),
                               new Vector3(50, 0, 0),
                               new Vector3(50, 0, 50),
                               new Vector3(0, 0, 50),
                               new Vector3(0, 0, 0)];

class MockEngine extends Engine {
    public getDriveTorque(): number {
        return 10000;
    }
}

describe("AIController", () => {

    let car: Car;
    let ai: AIController;

    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({providers: [CameraManagerService]});
        car = new Car(TestBed.get(CameraManagerService), new MockEngine());
        ai = new AIController();
        car.add(ai);

        await car.init(CAR_DEFAULT_POSITION, "yellow");
        ai.init(track);
        done();
    });

    it("should move by itself", () => {
        const tempPos: Vector3 = car.getPosition().clone();
        ai.update(MS_BETWEEN_FRAMES);
        car.update(MS_BETWEEN_FRAMES);
        expect(car.getPosition().clone().equals(tempPos)).toBeFalsy();
    });
});
