import { Object3D, Vector3 } from "three";
import { CarControl } from "../car/car-control";
import { Car } from "../car/car";

export class AIController extends Object3D {
    private carControl: CarControl;

    public constructor() {
        super();
    }

    public init(): void {
        if (this.parent != null && this.parent instanceof Car) {
            this.carControl = this.parent.carControl;
            this.carControl.accelerate();
        }
    }

    public update(): void {
        //
    }

    private getPosition(): Vector3 {
        if (this.parent != null && this.parent instanceof Car) {
            return this.parent.getPosition().clone();
        }

        return new Vector3();
    }
}
