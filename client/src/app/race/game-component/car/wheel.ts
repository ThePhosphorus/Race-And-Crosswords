import { DEFAULT_WHEEL_RADIUS, DEFAULT_FRICTION_COEFFICIENT } from "../../race.constants";

export class Wheel {

    public radius: number;
    public frictionCoefficient: number;

    public constructor() {
        this.radius = DEFAULT_WHEEL_RADIUS;
        this.frictionCoefficient = DEFAULT_FRICTION_COEFFICIENT;
    }

}
