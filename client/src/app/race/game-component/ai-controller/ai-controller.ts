import { Object3D, Vector3 } from "three";
import { CarControl } from "../car/car-control";
import { Car } from "../car/car";
import { RigidBody } from "../rigid-body/rigid-body";

const MINIMUM_STEERING_DISTANCE_FACTOR: number = 20;

export class AIController extends Object3D {
    private carControl: CarControl;
    private track: Array<Vector3>;
    private wallCollisionTimer: number;

    public constructor() {
        super();
        this.wallCollisionTimer = 0;
    }

    public init(track: Array<Vector3>): void {
        if (this.parent != null && this.parent instanceof Car) {
            this.carControl = this.parent.carControl;
            this.parent.rigidBody.addCollisionObserver((otherRb) => this.onCollision(otherRb));
        }
        this.track = track;
    }

    public update(deltaTime: number): void {
        if (this.track != null) {
            this.carControl.accelerate();
            const nextPointIndex: number = this.findNextPoint();
            if (nextPointIndex !== -1) {
                const objective: number = this.findObjective(nextPointIndex);
                this.applyAcceleration(nextPointIndex, deltaTime);
                this.applySteering(objective);
            }
        }
    }

    private onCollision(otherRb: RigidBody): void {
        if (otherRb.fixed) {
            this.wallCollisionTimer = 500;
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

    private getSpeed(): number {
        if (this.parent != null && this.parent instanceof Car) {
            return this.parent.speed;
        }

        return 0;
    }

    private findObjective(nextPointIndex: number): number {
        const p0: Vector3 = this.track[(nextPointIndex === 0) ? this.track.length - 1 : nextPointIndex - 1];
        const p1: Vector3 = this.track[nextPointIndex];
        const p2: Vector3 = this.track[(nextPointIndex + 1) % (this.track.length - 1)];
        const direction1: Vector3 = p1.clone().sub(p0);
        const direction2: Vector3 = p2.clone().sub(p1);
        const minimumDistance: number = direction1.angleTo(direction2) * MINIMUM_STEERING_DISTANCE_FACTOR;

        return this.getPosition().sub(p1).length() < minimumDistance ? (nextPointIndex + 1) % (this.track.length - 1) : nextPointIndex;
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

    private applySteering(objective: number): void {
        const objectiveDirection: Vector3 = this.wallCollisionTimer > 0 ?
            this.getPosition().sub(this.track[(objective === 0) ? this.track.length - 1 : objective - 1]) :
            this.getPosition().sub(this.track[objective]);
        const steeringDirection: number = this.getDirection().cross(objectiveDirection).y * Math.sign(this.getSpeed());
        if (steeringDirection > 0) {
            this.carControl.releaseSteeringLeft();
            this.carControl.steerRight();
        } else {
            this.carControl.releaseSteeringRight();
            this.carControl.steerLeft();
        }
    }

    private applyAcceleration(nextPointIndex: number, deltaTime: number): void {
        if (this.wallCollisionTimer > 0) {
            this.wallCollisionTimer -= deltaTime;
            this.carControl.releaseAccelerator();
            this.carControl.brake();
        } else {
            this.carControl.releaseBrakes();
            this.carControl.accelerate();
        }
    }
}