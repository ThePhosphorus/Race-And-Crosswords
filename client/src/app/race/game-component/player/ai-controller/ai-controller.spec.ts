import { Car } from "../../car/car";
import { AIController } from "./ai-controller";
import { TestBed } from "@angular/core/testing";
import { CameraManagerService } from "../../../camera-manager-service/camera-manager.service";
import { Engine } from "../../car/engine";
import { Vector3 } from "three";
import { LoaderService } from "../../loader-service/loader.service";
import { LoadedObject } from "../../loader-service/load-types.enum";
import { TrackPosition } from "../track-position/track-position";

/* tslint:disable: no-magic-numbers */
const MS_BETWEEN_FRAMES: number = 15;
const CAR_DEFAULT_POSITION: Vector3 = new Vector3(10, 0, -10);
const track: Array<Vector3> = [new Vector3(0, 0, 0),
                               new Vector3(-50, 0, 0),
                               new Vector3(-50, 0, -50),
                               new Vector3(50, 0, -50),
                               new Vector3(50, 0, 0),
                               new Vector3(0, 0, 0)];

class MockEngine extends Engine {
    public getDriveTorque(): number {
        return 10000;
    }
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000; // 60 Secs

describe("AIController", () => {

    let car: Car;
    let ai: AIController;

    beforeEach(() => {
        TestBed.configureTestingModule({providers: [CameraManagerService, LoaderService]});
        car = new Car(true, new MockEngine());
        ai = new AIController();
        car.add(ai);

        car.init(CAR_DEFAULT_POSITION, TestBed.get(LoaderService), LoadedObject.carYellow, TestBed.get(CameraManagerService).audioListener);
        car.initCarLights(false);
        ai.init(new TrackPosition(track));
    });

    it("should move by itself", () => {
        const tempPos: Vector3 = car.getPosition().clone();
        ai.update(MS_BETWEEN_FRAMES);
        car.update(MS_BETWEEN_FRAMES);
        expect(car.getPosition().clone().equals(tempPos)).toBeFalsy();
    });

    it("should turn by itself", () => {
        ai.update(MS_BETWEEN_FRAMES);
        car.update(MS_BETWEEN_FRAMES);
        expect(car.carControl.isSteeringLeft || car.carControl.isSteeringRight).toBeTruthy();
    });

    it("should move towards road", () => {
        const roadDistance: number = track[1].clone().sub(car.getPosition()).length();
        ai.update(MS_BETWEEN_FRAMES * 10);
        car.update(MS_BETWEEN_FRAMES * 10);

        expect(track[1].clone().sub(car.getPosition()).length()).toBeLessThan(roadDistance);
    });

    it("should follow the road", () => {
        const roadDir: Vector3 = track[1].clone().sub(car.getPosition());
        const carDir: Vector3 = car.direction.clone();
        const roadSide: number = -Math.sign(roadDir.cross(carDir).y);
        ai.update(MS_BETWEEN_FRAMES * 10);
        car.update(MS_BETWEEN_FRAMES * 10);

        const steeringState: number = (car.carControl.isSteeringLeft === car.carControl.isSteeringRight) ? 0 :
            car.carControl.isSteeringLeft ? 1 : -1;

        expect(roadSide).toBe(steeringState);
    });
});
