import { Collider } from "./collider";
import { Vector3 } from "three";

const HALF: number = 0.5;

export class BoxCollider extends Collider {
    private width: number;
    private height: number;
    private radius: number;
    private offset: Vector3;

    public constructor(width: number, height: number, offset: Vector3) {
        super();
        this.width = width;
        this.height = height;
        this.offset = offset.clone();
        this.radius = this.pythagore(this.width * HALF, this.height * HALF);
    }

    public get broadRadius(): number {
        return this.radius;
    }

    public get position(): Vector3 {
        return this.parent.position.clone().add(this.offset);
    }

    private pythagore(x: number, y: number): number {
        return Math.sqrt((x * x) + (y * y));
    }
}
