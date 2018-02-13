import { ConstraintValidator } from "./constraint-validator";
import { Vector3 } from "three";

describe("ConstraintValidatorService", () => {
    it("should be created",  () => {
        const points: Array<Vector3> = new Array<Vector3>();
        const service: ConstraintValidator = new ConstraintValidator(points);
        expect(service).toBeTruthy();
    });

    it("should return false when segments cross");
});
