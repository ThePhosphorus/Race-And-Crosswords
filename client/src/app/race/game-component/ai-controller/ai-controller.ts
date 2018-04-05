import { Object3D, Vector3 } from "three";
import { CarControl } from "../car/car-control";
import { Car } from "../car/car";
import { Track } from "../../../../../../common/race/track";

export class AIController extends Object3D {
    private carControl: CarControl;
    private track: Track;

    public constructor() {
        super();
    }

    public init(track: Track): void {
        if (this.parent != null && this.parent instanceof Car) {
            this.carControl = this.parent.carControl;
            this.carControl.accelerate();
        }
        this.track = track;
    }

    public update(): void {
        if (this.track != null) {
            // Do ai stuff
        }
    }

    private getPosition(): Vector3 {
        if (this.parent != null && this.parent instanceof Car) {
            return this.parent.getPosition().clone();
        }

        return new Vector3();
    }
}
