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
        if (this.track != null) {
            const nextPointIndex: number = this.findNextPoint();
            if (nextPointIndex !== -1) {
                const objective: Vector3 = this.track[nextPointIndex];
                if (objective.clone().sub(this.getPosition()).length() > 5) {
                    this.carControl.releaseBrakes();
                    this.carControl.accelerate();
                } else {
                    this.carControl.releaseAccelerator();
                    this.carControl.brake();
                }
            }

        }
    }

    private getPosition(): Vector3 {
        if (this.parent != null && this.parent instanceof Car) {
            return this.parent.getPosition().clone();
        }

        return new Vector3();
    }

    private findNextPoint(): number {
        const pos: Vector3 = this.getPosition();
        let minDistance: number = Number.MAX_VALUE;
        let point: number = -1;
        for (let i: number = 0; i < this.track.length; i++) {
            const nextIndex: number = (i === this.track.length - 1) ? 1 : i + 1;
            const p1: Vector3 = this.track[i];
            const p2: Vector3 = this.track[nextIndex];
            const distance: number = Math.abs((p2.z - p1.z) * pos.x - (p2.x - p1.x) * pos.z + p2.x * p1.z - p2.z * p1.x) /
                p1.clone().distanceTo(p2);
            if (distance < minDistance) {
                const dotProduct: number = p2.clone().sub(p1).dot(pos.clone().sub(p1));
                if (dotProduct > 1 && dotProduct < p2.clone().sub(p1).lengthSq()) {
                    point = nextIndex;
                    minDistance = distance;
                }
            }
        }

        return point;
    }
}
