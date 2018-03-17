import { Vector2, Object3D } from "three";

export class RigidBody extends Object3D {

    private forces: Vector2;
    private angularForces: Vector2;
    private velocity: Vector2;
    private angularVelocity: Vector2;
    private fixed: boolean;
    private mass: number;

    public constructor(mass: number, fixed?: boolean) {
        super();
        this.fixed = fixed == null ? false : fixed;
        this.angularForces = new Vector2();
        this.forces = new Vector2();
        this.velocity = new Vector2();
        this.angularVelocity = new Vector2();
        this.mass = mass;
    }

    public addForce(force: Vector2): void {
        this.forces.add(force);
    }

    public addAngularForce(force: Vector2): void {
        this.angularForces.add(force);
    }

    public addForceAtPosition(force: Vector2, position: Vector2): void {
        // TODO
    }

    public update(deltaTime: number): void {
        if (this.fixed) {
            this.forces = new Vector2();
            this.angularForces = new Vector2();

            return;
        }
    }
}
