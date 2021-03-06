import { Vector3, Vector2, Object3D, PlaneBufferGeometry, MeshBasicMaterial, Color, Mesh } from "three";
import { RigidBody } from "../rigid-body/rigid-body";

const SHOW_COLLIDERS: boolean = false; // Allow to debug colliders by displaying a square above them
const COLLIDER_DISPLAY_HEIGHT: number = 0.2;
const HALF: number = 0.5;

export class Collider extends Object3D {

    private _radius: number;
    private _relativeVertices: Vector3[];

    public constructor(width: number, length: number) {
        super();
        this._radius = this.pythagore(width * HALF, length * HALF);
        this._relativeVertices = new Array<Vector3>();
        this.initialiseRelativeVertices(width, length);
        if (SHOW_COLLIDERS) {
            this.displayCollider(width, length);
        }
    }

    public getNormals(): Array<Vector2> {
        const normals: Array<Vector2> = new Array<Vector2>();
        const vertices: Array<Vector2> = this.getAbsoluteVertices2D();
        for (let i: number = 0; i < vertices.length; i++) {
            const vertex1: Vector2 = vertices[i];
            const vertex2: Vector2 = i < vertices.length - 1 ? vertices[i + 1] : vertices[0];
            const edge: Vector2 = vertex1.clone().sub(vertex2).normalize();
            const normal: Vector2 = new Vector2(
                edge.y,
                -edge.x
            );
            normals.push(normal);
        }

        return normals;
    }

    public get rigidBody(): RigidBody {
        return this.parent.children.find((c) => c instanceof RigidBody) as RigidBody;
    }

    public getAbsoluteVertices2D(): Vector2[] {
        const vertices: Array<Vector2> = new Array<Vector2>();
        for (const vertex of this._relativeVertices) {
            const absoluteVertex3D: Vector3 = vertex.clone().applyMatrix4(this.parent.matrix);
            vertices.push(new Vector2(absoluteVertex3D.x, absoluteVertex3D.z));
        }

        return vertices;
    }

    public getBroadRadius(): number {
        return this._radius;
    }

    public getAbsolutePosition(): Vector3 {
        return this.parent.position.clone();
    }

    private pythagore(x: number, y: number): number {
        return Math.sqrt((x * x) + (y * y));
    }

    private initialiseRelativeVertices(width: number, length: number): void {
        this._relativeVertices.push(new Vector3((width * HALF), 0, (length * HALF)));
        this._relativeVertices.push(new Vector3(-(width * HALF), 0, (length * HALF)));
        this._relativeVertices.push(new Vector3(-(width * HALF), 0, -(length * HALF)));
        this._relativeVertices.push(new Vector3((width * HALF), 0, -(length * HALF)));
    }

    // For debug purposes
    public displayCollider(width: number, height: number): void {
        const geometry: PlaneBufferGeometry = new PlaneBufferGeometry(width, height);
        geometry.rotateX(-Math.PI / 2);
        geometry.translate(0, COLLIDER_DISPLAY_HEIGHT, 0);
        const mat: MeshBasicMaterial = new MeshBasicMaterial();
        mat.color = new Color("yellow");
        const mesh: Mesh = new Mesh(geometry, mat);

        this.add(mesh);
    }
}
