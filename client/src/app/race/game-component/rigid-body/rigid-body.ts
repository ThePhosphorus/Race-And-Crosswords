import { Vector2, Object3D, Vector3 } from "three";

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
        this.forces.add(force);
    }

    public addTorque(torque: number): void {
        this.torque += torque;
    }

    public addForceAtPosition(force: Vector2, position: Vector2): void {
        // TODO
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

        const deltaPosition: Vector2 = this._velocity.clone().multiplyScalar(deltaTime);
        this.parent.position.add(new Vector3(deltaPosition.x, 0, deltaPosition.y));

        const deltaAngle: number = this._angularVelocity * deltaTime;
        this.parent.rotateOnAxis(new Vector3(0, 1, 0), deltaAngle);

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
