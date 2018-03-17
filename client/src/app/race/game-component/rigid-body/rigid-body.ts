import { Vector2, Object3D, Vector3, Mesh } from "three";

export class RigidBody extends Object3D {

    private forces: Vector2;
    private torque: number;
    private velocity: Vector2;
    private angularVelocity: number;
    private fixed: boolean;
    private _mass: number;

    public get mass(): number {
        return this._mass;
    }

    public constructor(mass: number, fixed?: boolean) {
        super();
        this.fixed = fixed == null ? false : fixed;
        this.torque = 0;
        this.forces = new Vector2();
        this.velocity = new Vector2();
        this.angularVelocity = 0;
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
        if (!(this.parent instanceof Mesh)) {
            return;
        }
        if (this.fixed) {
            this.forces = new Vector2();
            this.torque = 0;

            return;
        }

        this.velocity.add(this.getDeltaVelocity(deltaTime));
        this.angularVelocity += this.getDeltaAngularVelocity(deltaTime);

        const deltaPosition: Vector2 = this.velocity.clone().multiplyScalar(deltaTime);
        this.parent.position.add(new Vector3(deltaPosition.x, 0, deltaPosition.y));

        const deltaAngle: number = this.angularVelocity * deltaTime;
        this.parent.rotateOnAxis(new Vector3(0, 1, 0), deltaAngle);
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
