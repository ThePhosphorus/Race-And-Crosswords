import {
    Engine, DEFAULT_GEAR_RATIOS, DEFAULT_DRIVE_RATIO, DEFAULT_DOWNSHIFT_RPM,
    DEFAULT_MINIMUM_RPM, DEFAULT_SHIFT_RPM, DEFAULT_MAX_RPM, DEFAULT_TRANSMISSION_EFFICIENCY
} from "./engine";

/* tslint:disable: no-magic-numbers */
describe("Engine", () => {
    let engine: Engine;

    it("should be instantiable using default constructor", () => {
        engine = new Engine();
        expect(engine).toBeDefined();
        expect(engine.currentGear).toBe(0);
    });

    it("should be instantiated correctly when passing parameters", () => {
        const gearRatios: number[] = [6, 5, 4, 3, 2];
        const driveRatio: number = 2;
        const downShiftRPM: number = 2000;
        const minimumRPM: number = 1000;
        const shiftRPM: number = 4000;
        const transmissionEfficiency: number = 0.5;
        engine = new Engine(gearRatios, driveRatio, downShiftRPM, minimumRPM, shiftRPM, transmissionEfficiency);
        expect(engine).toBeDefined();
        expect(engine.currentGear).toBe(0);
        expect(engine.rpm).toBeGreaterThanOrEqual(minimumRPM);
    });

    it("should use default gear ratios when invalid data is provided", () => {
        let gearRatios: number[] = [];
        engine = new Engine(gearRatios);
        expect(engine).toBeDefined();
        expect(engine["gearRatios"]).toBe(DEFAULT_GEAR_RATIOS);

        gearRatios = [-7, 2];
        engine = new Engine(gearRatios);
        expect(engine).toBeDefined();
        expect(engine["gearRatios"]).toBe(DEFAULT_GEAR_RATIOS);
    });

    it("should use default rpm values when one value is invalid", () => {
        engine = new Engine(DEFAULT_GEAR_RATIOS, DEFAULT_DRIVE_RATIO, 0);
        expect(engine).toBeDefined();
        expect(engine["downshiftRPM"]).toBe(DEFAULT_DOWNSHIFT_RPM);
        expect(engine["minimumRPM"]).toBe(DEFAULT_MINIMUM_RPM);
        expect(engine["shiftRPM"]).toBe(DEFAULT_SHIFT_RPM);

        engine = new Engine(DEFAULT_GEAR_RATIOS, DEFAULT_DRIVE_RATIO, DEFAULT_DOWNSHIFT_RPM, -2);
        expect(engine).toBeDefined();
        expect(engine["downshiftRPM"]).toBe(DEFAULT_DOWNSHIFT_RPM);
        expect(engine["minimumRPM"]).toBe(DEFAULT_MINIMUM_RPM);
        expect(engine["shiftRPM"]).toBe(DEFAULT_SHIFT_RPM);

        engine = new Engine(
            DEFAULT_GEAR_RATIOS, DEFAULT_DRIVE_RATIO,
            DEFAULT_DOWNSHIFT_RPM, DEFAULT_MINIMUM_RPM, -100);

        expect(engine).toBeDefined();
        expect(engine["downshiftRPM"]).toBe(DEFAULT_DOWNSHIFT_RPM);
        expect(engine["minimumRPM"]).toBe(DEFAULT_MINIMUM_RPM);
        expect(engine["shiftRPM"]).toBe(DEFAULT_SHIFT_RPM);
    });

    it("should use default rpm values when shiftRPM < downshiftRPM", () => {
        engine = new Engine(
            DEFAULT_GEAR_RATIOS, DEFAULT_DRIVE_RATIO, DEFAULT_DOWNSHIFT_RPM,
            DEFAULT_DOWNSHIFT_RPM, DEFAULT_DOWNSHIFT_RPM - 10);

        expect(engine).toBeDefined();
        expect(engine["downshiftRPM"]).toBe(DEFAULT_DOWNSHIFT_RPM);
        expect(engine["minimumRPM"]).toBe(DEFAULT_MINIMUM_RPM);
        expect(engine["shiftRPM"]).toBe(DEFAULT_SHIFT_RPM);
    });

    it("should use default transmissionEfficiency when value is invalid", () => {
        engine = new Engine(
            DEFAULT_GEAR_RATIOS, DEFAULT_DRIVE_RATIO, DEFAULT_DOWNSHIFT_RPM,
            DEFAULT_DOWNSHIFT_RPM, DEFAULT_DOWNSHIFT_RPM, 0);

        expect(engine).toBeDefined();
        expect(engine["transmissionEfficiency"]).toBe(DEFAULT_TRANSMISSION_EFFICIENCY);
    });

    it("should use default drive ration when invalid values are provided", () => {
        const gearRatios: number[] = DEFAULT_GEAR_RATIOS;
        engine = new Engine(gearRatios, -2);
        expect(engine).toBeDefined();
        expect(engine["driveRatio"]).toBe(DEFAULT_DRIVE_RATIO);
    });

    it("should have a higher torque when rpm is higher.", () => {
        const gears: number[] = [1];
        const driveRatio: number = 1;
        const transmissionEfficiency: number = 1;
        engine = new Engine(gears, driveRatio, 800, 1000, 5000, transmissionEfficiency);
        expect(engine.currentGear).toBe(0);
        const stoppedTorque: number = engine.getDriveTorque();
        engine.update(500, 1);
        const movingTorque: number = engine.getDriveTorque();
        expect(movingTorque).toBeGreaterThan(stoppedTorque);
    });

    it("should have minimum rpm when speed is small", () => {
        engine = new Engine(DEFAULT_GEAR_RATIOS, DEFAULT_DRIVE_RATIO, 100, DEFAULT_MINIMUM_RPM, 1000);
        expect(engine.rpm).toBe(DEFAULT_MINIMUM_RPM);
        engine.update(0, 1);
        expect(engine.rpm).toBe(DEFAULT_MINIMUM_RPM);
    });

    it("should have rpm between min and max when moving", () => {
        engine = new Engine(DEFAULT_GEAR_RATIOS, DEFAULT_DRIVE_RATIO, 100, DEFAULT_MINIMUM_RPM, 1000);
        expect(engine.rpm).toBe(DEFAULT_MINIMUM_RPM);
        engine.update(10, 1);
        expect(engine.rpm).toBeGreaterThan(DEFAULT_MINIMUM_RPM);
        expect(engine.rpm).toBeLessThan(DEFAULT_MAX_RPM);
    });

    it("should gear up when accelerating and down when decelerating", () => {
        engine = new Engine(DEFAULT_GEAR_RATIOS, DEFAULT_DRIVE_RATIO, 100, 100, 1000);
        expect(engine.currentGear).toBe(0);

        let speed: number = 100;
        engine.update(speed, 1);
        expect(engine.currentGear).toBeGreaterThan(0);

        speed = 0;
        engine.update(speed, 1);
        expect(engine.currentGear).toBe(0);
    });

    it("should not calculate rpm using a negative speed.", () => {
        engine = new Engine();
        engine.update(-10, 1);
        expect(engine.rpm).toBe(engine["minimumRPM"]);
    });

    it("should throw an error when wheel radius is invalid.", () => {
        engine = new Engine();
        expect(() => { engine.update(10, 0); }).toThrowError();
    });
});
