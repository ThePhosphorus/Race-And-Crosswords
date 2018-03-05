import { Collider } from "./collider";
import { Vector3 } from "three";

const HALF: number = 0.5;

export class LineCollider extends Collider {
    private length: number;
    private radius: number;
    private offset: Vector3;

    public constructor(length: number, offset: Vector3) {
        super();
        this.length = length;
        this.offset = offset.clone();
        this.radius = HALF * this.length;
    }

    public getBroadRadius(): number {
        return this.radius;
    }

    public getAbsolutePosition(): Vector3 {
        return this.parent.position.clone().add(this.offset);
    }
}
