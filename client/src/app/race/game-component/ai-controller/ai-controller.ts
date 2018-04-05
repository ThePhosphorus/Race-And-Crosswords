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
            this.carControl.accelerate();
            const nextPointIndex: number = this.findNextPoint();
            if (nextPointIndex !== -1) {
                const objective: Vector3 = this.findObjective(nextPointIndex);
                this.applySteering(objective);
            }
        }
    }

    private getPosition(): Vector3 {
        if (this.parent != null && this.parent instanceof Car) {
            return this.parent.getPosition().clone();
        }

        return new Vector3();
    }

    private getDirection(): Vector3 {
        if (this.parent != null && this.parent instanceof Car) {
            return this.parent.direction.clone();
        }

        return new Vector3();
    }

    private findObjective(nextPointIndex: number): Vector3 {
        const nextPoint: Vector3 = this.track[nextPointIndex];
        const followingPoint: Vector3 = this.track[(nextPointIndex === this.track.length - 1) ? 1 : nextPointIndex + 1];
        const minimumDistance: number = 15;

        return this.getPosition().sub(nextPoint).length() < minimumDistance ? followingPoint : nextPoint;
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

    private applySteering(objective: Vector3): void {
        const lookingDirection: Vector3 = this.getDirection();
        const steeringDirection: number = lookingDirection.clone().cross(objective).y;
        if (steeringDirection < 0) {
            this.carControl.releaseSteeringLeft();
            this.carControl.steerRight();
        } else {
            this.carControl.releaseSteeringRight();
            this.carControl.steerLeft();
        }
    }
}
