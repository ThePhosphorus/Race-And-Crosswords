import { Vector2, Object3D, Vector3 } from "three";
import { HALF } from "../../../global-constants/constants";

const MINIMUM_SPEED: number = 0.02;
const TWICE: number = 2;

export class RigidBody extends Object3D {

    private _fixed: boolean;
    private forces: Vector2;
    private frictionForce: Vector2;
    private torque: number;
    private _velocity: Vector2;
    private _angularVelocity: number;
    private _mass: number;
    private collisionObservers: Array<() => void>;

    public get mass(): number {
        return this._mass;
    }

    public get velocity(): Vector2 {
        return this._velocity;
    }

    public get angularVelocity(): number {
        return this._angularVelocity;
    }

    public get fixed(): boolean {
        return this._fixed;
    }

    public constructor(mass: number, fixed?: boolean) {
        super();
        this._fixed = fixed == null ? false : fixed;
        this.torque = 0;
        this.forces = new Vector2(0, 0);
        this.frictionForce = new Vector2(0, 0);
        this._velocity = new Vector2(0, 0);
        this._angularVelocity = 0;
        this._mass = mass;
        this.collisionObservers = new Array<() => void>();
    }

    public addForce(force: Vector2): void {
        if (force != null) {
            this.forces.add(force);
        }
    }

    public setFrictionForce(force: Vector2): void {
        if (force != null) {
            this.frictionForce = force;
        }
    }

    public addTorque(torque: number): void {
        this.torque += torque;
    }

    public addCollisionObserver(callback: () => void): void {
        this.collisionObservers.push(callback);
    }

    public applyCollision(contactAngle: number, otherMass: number, otherVelocity: Vector2): void {
        contactAngle -= Math.PI * HALF;
        const vx: number = ((this._velocity.length() * Math.cos(this._velocity.angle() - contactAngle) *
            (this._mass - otherMass) +
            (otherVelocity.length() * otherMass * Math.cos(otherVelocity.clone().angle() - contactAngle) * TWICE)) /
            (this.mass + otherMass)) * Math.cos(contactAngle) - this._velocity.length() *
            Math.sin(this._velocity.angle() - contactAngle) * Math.sin(contactAngle);

        const vy: number = ((this._velocity.length() * Math.cos(this._velocity.angle() - contactAngle) *
            (this._mass - otherMass) +
            (otherVelocity.length() * otherMass * Math.cos(otherVelocity.clone().angle() - contactAngle) * TWICE)) /
            (this.mass + otherMass)) * Math.sin(contactAngle) + this._velocity.length() *
            Math.sin(this._velocity.angle() - contactAngle) * Math.cos(contactAngle);
        this._velocity = new Vector2(vx, vy);
        this.onCollision();
    }

    public update(deltaTime: number): void {
        if (!(this.parent instanceof Object3D)) {
            return;
        }
        if (this._fixed) {
            this.forces = new Vector2();
            this.torque = 0;

            return;
        }

        this._velocity.add(this.getDeltaVelocity(this.forces, deltaTime));
        this._angularVelocity += this.getDeltaAngularVelocity(this.torque, deltaTime);

        // Round down to 0 if speed is too small
        this._velocity.setLength(this._velocity.length() <= MINIMUM_SPEED ? 0 : this._velocity.length());
        this._angularVelocity = this._angularVelocity <= MINIMUM_SPEED ? 0 : this._angularVelocity;

        this.applyFrictionForce(deltaTime);

        const deltaPosition: Vector2 = this._velocity.clone().multiplyScalar(deltaTime);
        this.parent.position.add(new Vector3(deltaPosition.x, 0, deltaPosition.y));

        const deltaAngle: number = this._angularVelocity * deltaTime;
        this.parent.rotateY(deltaAngle);

        this.forces = new Vector2(0, 0);
        this.torque = 0;
        this.frictionForce = new Vector2(0, 0);
    }

    private getDeltaVelocity(force: Vector2, deltaTime: number): Vector2 {
        return this.getAcceleration(force).multiplyScalar(deltaTime);
    }

    private getDeltaAngularVelocity(torque: number, deltaTime: number): number {
        return torque * deltaTime;
    }

    private getAcceleration(force: Vector2): Vector2 {
        return force.divideScalar(this._mass);
    }

    private applyFrictionForce(deltaTime: number): void {
        const frictionCausedVelocity: Vector2 = this.getDeltaVelocity(this.frictionForce, deltaTime);
        const projectedVelocity: number = this._velocity.clone().dot(frictionCausedVelocity.clone().normalize());
        const projectedNewVelocity: number = frictionCausedVelocity.length() + projectedVelocity;
        this._velocity.add(Math.sign(projectedNewVelocity) === Math.sign(projectedVelocity) ?
            frictionCausedVelocity : frictionCausedVelocity.setLength(-projectedVelocity));
    }

    private onCollision(): void {
       this.collisionObservers.forEach((collisionObserver) => collisionObserver());
    }
}
