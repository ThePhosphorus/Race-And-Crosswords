import { Collider } from "./collider";
import { Vector3 } from "three";

const HALF: number = 0.5;

export class BoxCollider extends Collider {
    private width: number;
    private height: number;
    private radius: number;
    private offset: Vector3;
    private vertexes: Vector3[];

    public constructor(width: number, height: number, y: number, offset: Vector3) {
        super();
        this.width = width;
        this.height = height;
        this.offset = new Vector3(0, 0, 0);
        this.radius = this.pythagore(this.width * HALF, this.height * HALF);
        this.vertexes = new Array<Vector3>();
        this.initialiseVertexes(y);
    }

    public getBroadRadius(): number {
        return this.radius;
    }
    public getVertexes(): Vector3[] {
        return this.vertexes;
    }
    public getAbsolutePosition(): Vector3 {
        return this.parent.position.clone().add(this.offset);
    }

    private pythagore(x: number, y: number): number {
        return Math.sqrt((x * x) + (y * y));
    }

    private initialiseVertexes(y: number): void {
        this.vertexes.push(new Vector3(this.width * HALF, y, this.height * HALF));
        this.vertexes.push(new Vector3(this.width * HALF, y, -this.height * HALF));
        this.vertexes.push(new Vector3(-this.width * HALF, y, this.height * HALF));
        this.vertexes.push(new Vector3(-this.width * HALF, y, -this.height * HALF));
    }
}
