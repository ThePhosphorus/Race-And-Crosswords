import { Object3D, Vector3 } from "three";
import { CarControl } from "../car/car-control";
import { Car } from "../car/car";

export class AIController extends Object3D {
    private carControl: CarControl;
    private track: Array<Vector3>;

    public constructor() {
        super();
    }

    public init(track: Array<Vector3>): void {
        if (this.parent != null && this.parent instanceof Car) {
            this.carControl = this.parent.carControl;
        }
        this.track = track;
    }

    public update(): void {
        if (this.track != null && this.getPosition() != null) {
            this.carControl.accelerate();
        }
    }

    private getPosition(): Vector3 {
        if (this.parent != null && this.parent instanceof Car) {
            return this.parent.getPosition().clone();
        }

        return new Vector3();
    }
}
