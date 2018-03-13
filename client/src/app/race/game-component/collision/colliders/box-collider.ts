import { Collider } from "./collider";
import { Vector3, Vector2, Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";

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
        this.add(new Mesh( new PlaneGeometry( this.width, this.height).rotateX(-Math.PI/2).translate(0,2,0), new MeshBasicMaterial( {color: 0xffff00, side: DoubleSide} ) ));
    }

    public getBroadRadius(): number {
        return this.radius;
    }

    public getAbsolutePosition(): Vector3 {
        return this.parent.position.clone().add(this.offset);
    }

    public getNormals(): Array<Vector2> {
        const normals: Array<Vector2> = new Array<Vector2>();
        const vertexes: Array<Vector2> = this.getVertexes();
        for (const vertex of vertexes) {
            const normal: Vector2 = new Vector2(
                vertex.y,
                vertex.x
            );
            normals.push(normal);
        }

        return normals;
    }

    public getVertexes(): Array<Vector2> {
        const vertexes: Array<Vector2> = new Array<Vector2>();
        const absPos: Vector3 = this.getAbsolutePosition();
        const x: number = absPos.x;
        const y: number = absPos.z;
        vertexes.push(new Vector2(x - HALF * this.width, y - HALF * this.height));
        vertexes.push(new Vector2(x - HALF * this.width, y + HALF * this.height));
        vertexes.push(new Vector2(x + HALF * this.width, y - HALF * this.height));
        vertexes.push(new Vector2(x + HALF * this.width, y + HALF * this.height));

        return vertexes;
    }

    private pythagore(x: number, y: number): number {
        return Math.sqrt((x * x) + (y * y));
    }
}
