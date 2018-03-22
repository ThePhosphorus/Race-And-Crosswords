import { RigidBody } from "./rigid-body";
import { DEFAULT_MASS } from "../../race.constants";
import { Object3D, Vector2, Vector3 } from "three";

const DEFAULT_DELTA_TIME: number = 1;

/* tslint:disable: no-magic-numbers */
describe("Rigid Body", () => {
    let rb: RigidBody;
    let obj: Object3D;

    beforeEach(() => {
        rb = new RigidBody(DEFAULT_MASS, false);
        obj = new Object3D();
        obj.add(rb);
    });

    it("should be instantiable using default constructor", () => {
        rb = new RigidBody(DEFAULT_MASS, false);
        expect(rb).toBeDefined();
        expect(rb.velocity.length()).toBe(0);
    });

    it("should move when adding force", () => {
        const tempPos: Vector3 = obj.position.clone();
        rb.addForce(new Vector2(1000, 0));
        rb.update(DEFAULT_DELTA_TIME);
        expect(!obj.position.equals(tempPos)).toBeTruthy();
    });

    it("should move only in the direction of the force", () => {
        const tempPos: Vector3 = obj.position.clone();
        rb.addForce(new Vector2(1000, 0));
        rb.update(DEFAULT_DELTA_TIME);
        expect(!obj.position.clone().sub(tempPos).x).toBeGreaterThan(0);
        expect(!obj.position.clone().sub(tempPos).y).toEqual(0);
    });

    it("should rotate when adding torque", () => {
        const tempRotation: number = obj.rotation.y;
        rb.addTorque(1);
        rb.update(DEFAULT_DELTA_TIME);
        expect(obj.rotation.y !== tempRotation).toBeTruthy();
    });

    it("should not move when adding friction force", () => {
        const tempPos: Vector3 = obj.position.clone();
        rb.setFrictionForce(new Vector2(1000, 0));
        rb.update(DEFAULT_DELTA_TIME);
        expect(obj.position.equals(tempPos)).toBeTruthy();
    });

    it("should apply collision", () => {
        const tempPos: Vector3 = obj.position.clone();
        const objVelocity: Vector2 = new Vector2(100, 0);
        rb.applyCollision(0, DEFAULT_MASS, objVelocity);
        rb.update(DEFAULT_DELTA_TIME);
        expect(rb.velocity.equals(objVelocity)).toBeTruthy();
        expect(!obj.position.equals(tempPos)).toBeTruthy();
    });
});
