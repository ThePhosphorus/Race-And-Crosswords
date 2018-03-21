import { Collider } from "./colliders/collider";
import { Vector2 } from "three";

export class Collision {
    public coll1: Collider;
    public coll2: Collider;
    // public collidingPoint1: Vector2;
    // public collidingPoint2: Vector2;
    public overlap: number;
    public normal: Vector2;

    public constructor(coll1: Collider, coll2: Collider, normal: Vector2, overlap: number) {
        this.coll1 = coll1;
        this.coll2 = coll2;
        // this.collidingPoint1 = collidingPoint1;
        // this.collidingPoint2 = collidingPoint2;
        this.normal = normal;
        this.overlap = overlap;
    }

    public get contactAngle(): number {
        return new Vector2(this.normal.y, -this.normal.x).angle();
    }
}
