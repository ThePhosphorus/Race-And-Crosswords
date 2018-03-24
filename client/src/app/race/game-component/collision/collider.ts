import { Vector3, Vector2, Object3D, PlaneBufferGeometry, MeshBasicMaterial, Color, Mesh } from "three";
import { RigidBody } from "../rigid-body/rigid-body";

const SHOW_COLLIDERS: boolean = false; // Allow to debug colliders by displaying a square above them
const COLLIDER_DISPLAY_HEIGHT: number = 0.2;
const HALF: number = 0.5;

export class Collider extends Object3D {

    private radius: number;
    private relativeVertexes: Vector3[];

    public constructor(width: number, length: number) {
        super();
        this.radius = this.pythagore(width * HALF, length * HALF);
        this.relativeVertexes = new Array<Vector3>();
        this.initialiseRelativeVertexes(width, length);
        if (SHOW_COLLIDERS) {
            this.displayCollider(width, length);
        }
    }

    public getNormals(): Array<Vector2> {
        const normals: Array<Vector2> = new Array<Vector2>();
        const vertexes: Array<Vector2> = this.getAbsoluteVertexes2D();
        for (let i: number = 0; i < vertexes.length; i++) {
            const vertex1: Vector2 = vertexes[i];
            const vertex2: Vector2 = i < vertexes.length - 1 ? vertexes[i + 1] : vertexes[0];
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

    private initialiseRelativeVertexes(width: number, length: number): void {
        this.relativeVertexes.push(new Vector3((width * HALF), 0, (length * HALF)));
        this.relativeVertexes.push(new Vector3(-(width * HALF), 0, (length * HALF)));
        this.relativeVertexes.push(new Vector3(-(width * HALF), 0, -(length * HALF)));
        this.relativeVertexes.push(new Vector3((width * HALF), 0, -(length * HALF)));
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
