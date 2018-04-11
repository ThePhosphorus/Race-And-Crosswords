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
const MAXIMUM_ZIG_ZAG: number = 90;
const ZIG_ZAG_ANGLE: number = 1.25;

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
            this.parent.rigidBody.addCollisionObserver((otherRb: RigidBody) => this.onCollision(otherRb));
        }
        this.track = track;
    }

    public update(deltaTime: number): void {
        if (this.track != null) {
            this.carControl.accelerate();
            const nextPointIndex: number = this.findNextPoint();
            if (nextPointIndex !== -1) {
                const target: number = this.findTargetPoint(nextPointIndex);
                this.wallCollisionTimer -= this.wallCollisionTimer > 0 ? deltaTime : 0;
                this.applyAcceleration(nextPointIndex);
                this.applySteering(target, nextPointIndex);
            }
        }
    }

    private onCollision(otherRb: RigidBody): void {
        if (otherRb.fixed && this.wallCollisionTimer <= 0 && this.getSpeed() < COLLISION_SPEED_THRESHOLD) {
            const nextPointIndex: number = this.findNextPoint();
            const p0: Vector3 = this.getSurroundingPoint(nextPointIndex, -1);
            const p1: Vector3 = this.track[nextPointIndex];
            if (this.getDirection().angleTo(p1.clone().sub(p0)) > WALL_COLLISION_ANGLE) {
                const trackDir: Vector3 = p1.clone().sub(p0);
                const carRelativePos: Vector3 = this.getPosition().sub(p0);
                const side: number = Math.sign(carRelativePos.cross(trackDir).y);
                const direction: number = Math.sign(this.getDirection().cross(trackDir).y);
                if (side === direction) {
                    this.wallCollisionTimer = DEFAULT_WALL_COLLISION_TIMER;
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

    private getSurroundingPoint(pointIndex: number, offsetIndex: number): Vector3 {
        return this.track[(pointIndex + offsetIndex + this.track.length) % this.track.length];
    }

    private pointAngle(nextPointIndex: number): number {
        const p0: Vector3 = this.getSurroundingPoint(nextPointIndex, -1);
        const p1: Vector3 = this.track[nextPointIndex];
        const p2: Vector3 = this.getSurroundingPoint(nextPointIndex, 1);
        const direction1: Vector3 = p1.clone().sub(p0);
        const direction2: Vector3 = p2.clone().sub(p1);

        return direction1.angleTo(direction2);
    }

    private findTargetPoint(nextPointIndex: number): number {
        const p1: Vector3 = this.track[nextPointIndex];
        let minimumDistance: number = this.pointAngle(nextPointIndex) * MINIMUM_STEERING_DISTANCE_FACTOR;
        minimumDistance = this.isZigZag(nextPointIndex) ? minimumDistance / 2 : minimumDistance;

        return this.getPosition().sub(p1).length() < minimumDistance ? (nextPointIndex + 1) % (this.track.length - 1) : nextPointIndex;
    }

    private isZigZag(nextPointIndex: number): boolean {
        const previous: Vector3 = this.getSurroundingPoint(nextPointIndex, -2);
        const p0: Vector3 = this.getSurroundingPoint(nextPointIndex, -1);
        const p1: Vector3 = this.track[nextPointIndex];
        const p2: Vector3 = this.getSurroundingPoint(nextPointIndex, 1);

        const l1: Vector3 = p0.clone().sub(previous);
        const l2: Vector3 = p1.clone().sub(p0);
        const l3: Vector3 = p2.clone().sub(p1);

        const hasBigAngle: boolean = l1.angleTo(l2) > ZIG_ZAG_ANGLE && l2.angleTo(l3) > ZIG_ZAG_ANGLE;
        const isSmallEnough: boolean = l2.length() < MAXIMUM_ZIG_ZAG;

        return hasBigAngle && isSmallEnough;
    }

    private findNextPoint(): number {
        const pos: Vector3 = this.getPosition();
        let minDistance: number = Number.MAX_VALUE;
        let point: number = -1;
        for (let i: number = 0; i < this.track.length; i++) {
            const nextIndex: number = (i === this.track.length - 1) ? 1 : i + 1;
            const p1: Vector3 = this.track[i];
            const p2: Vector3 = this.track[nextIndex];
            const distance: number = this.distanceToLine(p1, p2, pos);

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

    private distanceToLine(p1: Vector3, p2: Vector3, pos: Vector3): number {
        return Math.abs((p2.z - p1.z) * pos.x - (p2.x - p1.x) * pos.z + p2.x * p1.z - p2.z * p1.x) /
            p1.clone().distanceTo(p2);
    }

    private applySteering(target: number, nextPointIndex: number): void {
        const targetDirection: Vector3 = this.getPosition().sub(this.track[target]);
        const steeringDirection: number = this.getDirection().cross(targetDirection).y * Math.sign(this.getSpeed());
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
}
