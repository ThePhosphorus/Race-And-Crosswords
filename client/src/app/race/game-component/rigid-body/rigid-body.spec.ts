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
        expect(obj.position.clone().sub(tempPos).x).toBeGreaterThan(0);
        expect(obj.position.clone().sub(tempPos).y).toEqual(0);
    });

    it("should not move when adding friction force", () => {
        const tempPos: Vector3 = obj.position.clone();
        rb.addFrictionForce(new Vector2(1000, 0));
        rb.update(DEFAULT_DELTA_TIME);
        expect(obj.position.equals(tempPos)).toBeTruthy();
    });

    it("should apply collision", () => {
        const tempPos: Vector3 = obj.position.clone();
        const objVelocity: Vector2 = new Vector2(0, 10000);
        rb.applyCollision(0, DEFAULT_MASS, objVelocity);
        rb.update(DEFAULT_DELTA_TIME);
        expect(rb.velocity.length()).toEqual(objVelocity.length());
        expect(!obj.position.equals(tempPos)).toBeTruthy();
    });
});
