import { Collider } from "./collider";
import { Vector3, Vector2, Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";

const HALF: number = 0.5;

export class BoxCollider extends Collider {

    private radius: number;
    private relativeVertexes: Vector3[];

    public constructor(width: number, length: number, height: number) {
        super();
        this.radius = this.pythagore(width * HALF, length * HALF);
        this.relativeVertexes = new Array<Vector3>();
        this.initialiseRelativeVertexes(width, length, height);
        this.add(new Mesh( new PlaneGeometry( width, length).rotateX(-Math.PI / 2)
                            .translate(0, 2, 0),
                           new MeshBasicMaterial( {color: 0xffff00, side: DoubleSide} ) ));
    }

    public getNormals(): Array<Vector2> {
        const normals: Array<Vector2> = new Array<Vector2>();
        const vertexes: Array<Vector2> = this.getAbsoluteVertexes2D();
        for (let i: number = 0; i < vertexes.length; i++) {
            const vertex1: Vector2 = vertexes[i];
            const vertex2: Vector2 = i < vertexes.length - 1 ? vertexes[i + 1] : vertexes[0];
            const vertex: Vector2 = vertex1.sub(vertex2);
            const normal: Vector2 = new Vector2(
                vertex.y,
                vertex.x
            ).normalize();
            normals.push(normal);
        }

        return normals;
    }
    public getAbsoluteVertexes2D(): Vector2[] {
        const vertexes: Array<Vector2> = new Array<Vector2>();
        for (const vertex of this.relativeVertexes) {
            const absoluteVertex3D: Vector3 = vertex.clone().applyMatrix4(this.parent.matrix);
            vertexes.push(new Vector2(absoluteVertex3D.x, absoluteVertex3D.z));
        }

        return vertexes;
    }

    public getBroadRadius(): number {
        return this.radius;
    }

    public getAbsolutePosition(): Vector3 {
        return this.parent.position.clone();
    }

    private pythagore(x: number, y: number): number {
        return Math.sqrt((x * x) + (y * y));
    }

    private initialiseRelativeVertexes(width: number, length: number, height: number): void {
        this.relativeVertexes.push(new Vector3(width * HALF, height, length * HALF));
        this.relativeVertexes.push(new Vector3(width * HALF, height, -length * HALF));
        this.relativeVertexes.push(new Vector3(-width * HALF, height, length * HALF));
        this.relativeVertexes.push(new Vector3(-width * HALF, height, -length * HALF));
    }
}
