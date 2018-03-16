import { Vector2 } from "three";

export class RigidBody {

    private forces: Vector2;
    private angularForces: Vector2;
    private velocity: Vector2;
    private angularVelocity: Vector2;

    public constructor() { }

    public addForce(force: Vector2): void {
        //
    }

    public addAngularForce(force: Vector2): void {
        //
    }

    public update(deltaTime: number): void {
        //
    }
}
