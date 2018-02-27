import { Wheel, DEFAULT_WHEEL_MASS, DEFAULT_WHEEL_RADIUS, DEFAULT_FRICTION_COEFFICIENT } from "./wheel";

/* tslint:disable: no-magic-numbers */
describe("Wheel", () => {
    it("should be instantiated correctly using default constructor", () => {
        const wheel: Wheel = new Wheel();
        expect(wheel).toBeDefined();
    });

    it("should be instantiated correctly when passing parameters", () => {
        const mass: number = 100;
        const radius: number = 2;
        const frictionCoefficient: number = 0.2;
        const wheel: Wheel = new Wheel(mass, radius, frictionCoefficient);
        expect(wheel).toBeDefined();
        expect(wheel.frictionCoefficient).toBeCloseTo(frictionCoefficient);
        expect(wheel.radius).toBeCloseTo(radius);
        expect(wheel.mass).toBeCloseTo(mass);
        expect(wheel.angularVelocity).toBeCloseTo(0);
    });

    it("can't be instantiated with a negative mass", () => {
        const mass: number = -100;
        const wheel: Wheel = new Wheel(mass);
        expect(wheel).toBeDefined();
        expect(wheel.mass).toBeCloseTo(DEFAULT_WHEEL_MASS);
    });

    it("can't be instantiated with a negative friction coefficient", () => {
        const friction: number = -100;
        const wheel: Wheel = new Wheel(10, 10, friction);
        expect(wheel).toBeDefined();
        expect(wheel.frictionCoefficient).toBeCloseTo(DEFAULT_FRICTION_COEFFICIENT);
    });

    it("can't be instantiated with a negative radius", () => {
        const radius: number = -100;
        const wheel: Wheel = new Wheel(10, radius);
        expect(wheel).toBeDefined();
        expect(wheel.radius).toBeCloseTo(DEFAULT_WHEEL_RADIUS);
    });

    it("inertia should be properly calculated", () => {
        const mass: number = 100;
        const radius: number = 1;
        const expectedInertia: number = 50;
        const wheel: Wheel = new Wheel(mass, radius);
        expect(wheel.inertia).toBeCloseTo(expectedInertia);
    });

    it("angular velocity is properly modified", () => {
        const wheel: Wheel = new Wheel();
        expect(wheel.angularVelocity).toBeCloseTo(0);

        const newAngularVelocity: number = 100;
        wheel.angularVelocity = newAngularVelocity;
        expect(wheel.angularVelocity).toBeCloseTo(newAngularVelocity);
    });
});
