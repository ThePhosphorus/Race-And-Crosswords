import { Object3D, Vector3 } from "three";
import { CarControl } from "../car/car-control";
import { Car } from "../car/car";
import { RigidBody } from "../rigid-body/rigid-body";

const MINIMUM_STEERING_DISTANCE_FACTOR: number = 20;
const COLLISION_SPEED_THRESHOLD: number = 30;
const DEFAULT_WALL_COLLISION_TIMER: number = 2500;
const SLOWING_DISTANCE_FACTOR: number = 2.5;
const MINIMUM_SLOWING_DISTANCE: number = 10;
const WALL_COLLISION_ANGLE: number = 0.4;
const OBJECTIVE_MINIMUM_DISTANCE: number = 12;

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
                this.calculateWallCollision(deltaTime, nextPointIndex);
                this.applyAcceleration(nextPointIndex);
                this.applySteering(objective, nextPointIndex);
            }
        }
    }

    private onCollision(otherRb: RigidBody): void {
        if (otherRb.fixed && this.wallCollisionTimer <= 0 && this.getSpeed() < COLLISION_SPEED_THRESHOLD) {
            this.wallCollisionTimer = DEFAULT_WALL_COLLISION_TIMER;
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

    private pointAngle(nextPointIndex: number): number {
        const p0: Vector3 = this.track[(nextPointIndex === 0) ? this.track.length - 1 : nextPointIndex - 1];
        const p1: Vector3 = this.track[nextPointIndex];
        const p2: Vector3 = this.track[(nextPointIndex + 1) % (this.track.length - 1)];
        const direction1: Vector3 = p1.clone().sub(p0);
        const direction2: Vector3 = p2.clone().sub(p1);

        return direction1.angleTo(direction2);
    }

    private findObjective(nextPointIndex: number): number {
        const p1: Vector3 = this.track[nextPointIndex];
        const minimumDistance: number = (this.getSpeed() < OBJECTIVE_MINIMUM_DISTANCE) ? 0 :
            this.pointAngle(nextPointIndex) * MINIMUM_STEERING_DISTANCE_FACTOR;

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

    private applySteering(objective: number, nextPointIndex: number): void {
        const objectiveDirection: Vector3 = this.wallCollisionTimer > 0 ?
            this.getPosition().sub(this.track[nextPointIndex]) :
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

    private applyAcceleration(nextPointIndex: number): void {
        if (this.wallCollisionTimer > 0) {
            this.carControl.releaseAccelerator();
            this.carControl.brake();
        } else {
            const angle: number = this.pointAngle(nextPointIndex);
            const distanceToNext: number = this.getPosition().sub(this.track[nextPointIndex]).length();
            let slowingDistance: number = (angle * this.getSpeed() / SLOWING_DISTANCE_FACTOR);
            slowingDistance = slowingDistance < MINIMUM_SLOWING_DISTANCE ? 0 : slowingDistance;

            if (distanceToNext < slowingDistance) {
                this.carControl.handBrake();
            } else {
                this.carControl.releaseBrakes();
                this.carControl.releaseHandBrake();
                this.carControl.accelerate();
            }
        }
    }

    private calculateWallCollision(deltaTime: number, nextPointIndex: number): void {
        const p0: Vector3 = this.track[(nextPointIndex === 0) ? this.track.length - 1 : nextPointIndex - 1];
        const p1: Vector3 = this.track[nextPointIndex];
        if (this.getDirection().angleTo(p1.clone().sub(p0)) > WALL_COLLISION_ANGLE) {
            this.wallCollisionTimer -= deltaTime;
        } else {
            this.wallCollisionTimer = 0;
        }
    }
}
