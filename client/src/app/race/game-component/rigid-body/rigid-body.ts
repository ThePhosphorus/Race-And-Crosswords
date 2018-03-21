import { Vector2, Object3D, Vector3 } from "three";

const MINIMUM_SPEED: number = 0.02;

export class RigidBody extends Object3D {

    private fixed: boolean;
    private forces: Vector2;
    private torque: number;
    private _velocity: Vector2;
    private _angularVelocity: number;
    private _mass: number;

    public get mass(): number {
        return this._mass;
    }

    public get velocity(): Vector2 {
        return this._velocity;
    }

    public constructor(mass: number, fixed?: boolean) {
        super();
        this.fixed = fixed == null ? false : fixed;
        this.torque = 0;
        this.forces = new Vector2(0, 0);
        this._velocity = new Vector2(0, 0);
        this._angularVelocity = 0;
        this._mass = mass;
    }

    public addForce(force: Vector2): void {
        if (force != null) {
            this.forces.add(force);
        }
    }

    public addTorque(torque: number): void {
        this.torque += torque;
    }

    public applyCollision(contactAngle: number, otherMass: number, otherVelocity: Vector2): void {
        contactAngle -= Math.PI / 2;
        const vx: number = ((this._velocity.length() * Math.cos(this._velocity.angle() - contactAngle) *
            (this._mass - otherMass) +
            (otherVelocity.length() * otherMass * Math.cos(otherVelocity.clone().angle() - contactAngle) * 2)) /
            (this.mass + otherMass)) * Math.cos(contactAngle) - this._velocity.length() *
            Math.sin(this._velocity.angle() - contactAngle) * Math.sin(contactAngle);

        const vy: number = ((this._velocity.length() * Math.cos(this._velocity.angle() - contactAngle) *
            (this._mass - otherMass) +
            (otherVelocity.length() * otherMass * Math.cos(otherVelocity.clone().angle() - contactAngle) * 2)) /
            (this.mass + otherMass)) * Math.sin(contactAngle) + this._velocity.length() *
            Math.sin(this._velocity.angle() - contactAngle) * Math.cos(contactAngle);
        this._velocity = new Vector2(vx, vy);
    }

    public update(deltaTime: number): void {
        if (!(this.parent instanceof Object3D)) {
            return;
        }
        if (this.fixed) {
            this.forces = new Vector2();
            this.torque = 0;

            return;
        }

        this._velocity.add(this.getDeltaVelocity(deltaTime));
        this._angularVelocity += this.getDeltaAngularVelocity(deltaTime);

        // Round down to 0 if speed is too small
        this._velocity.setLength(this._velocity.length() <= MINIMUM_SPEED ? 0 : this._velocity.length());
        this._angularVelocity = this._angularVelocity <= MINIMUM_SPEED ? 0 : this._angularVelocity;

        const deltaPosition: Vector2 = this._velocity.clone().multiplyScalar(deltaTime);
        this.parent.position.add(new Vector3(deltaPosition.x, 0, deltaPosition.y));

        const deltaAngle: number = this._angularVelocity * deltaTime;
        this.parent.rotateY(deltaAngle);

        this.forces = new Vector2(0, 0);
        this.torque = 0;
    }

    private getDeltaVelocity(deltaTime: number): Vector2 {
        return this.getAcceleration().multiplyScalar(deltaTime);
    }

    private getDeltaAngularVelocity(deltaTime: number): number {
        return this.getAngularAcceleration() * deltaTime;
    }

    private getAcceleration(): Vector2 {
        return this.forces.divideScalar(this._mass);
    }

    private getAngularAcceleration(): number {
        return this.torque / this._mass;
    }
}
