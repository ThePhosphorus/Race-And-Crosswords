import { TestBed, inject } from "@angular/core/testing";

import { CollisionDetectorService } from "./collision-detector.service";
import { Object3D, Scene, Vector3, Vector2 } from "three";
import { Collider } from "./collider";
import { RigidBody } from "../rigid-body/rigid-body";
import { DEFAULT_MASS } from "../../race.constants";

const BOX_DIMENSION: number = 5;
const OBJ_POSITION: number = 2;
const OBJ_FORCE: number = 1000;

describe("CollisionDetectorService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CollisionDetectorService]
        });
    });

    it("should be created", inject([CollisionDetectorService], (service: CollisionDetectorService) => {
        expect(service).toBeTruthy();
    }));

    it("should resolve collision", inject([CollisionDetectorService], (service: CollisionDetectorService) => {
        const scene: Scene = new Scene();
        const obj1: Object3D = new Object3D();
        const obj2: Object3D = new Object3D();

        obj1.position.copy(new Vector3(-OBJ_POSITION, 0, 0));
        obj2.position.copy(new Vector3(OBJ_POSITION, 0, 0));

        const coll1: Collider = new Collider(BOX_DIMENSION, BOX_DIMENSION);
        const coll2: Collider = new Collider(BOX_DIMENSION, BOX_DIMENSION);
        const rb1: RigidBody = new RigidBody(DEFAULT_MASS);
        const rb2: RigidBody = new RigidBody(DEFAULT_MASS);

        obj1.add(coll1, rb1);
        obj2.add(coll2, rb2);
        scene.add(obj1, obj2);

        rb1.addForce(new Vector2(OBJ_FORCE, 0));
        rb1.update(1);

        const initialVelocity1: Vector2 = rb1.velocity.clone();
        const initialVelocity2: Vector2 = rb2.velocity.clone();

        service.detectCollisions(scene);

        expect(rb1.velocity.equals(initialVelocity1)).toBeFalsy();
        expect(rb2.velocity.equals(initialVelocity2)).toBeFalsy();
    }));
});
