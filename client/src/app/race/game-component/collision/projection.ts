import { Vector2 } from "three";

export class Projected {
    private _minProjected: number;
    private _maxProjected: number;
    private _minVertices: Array<Vector2>;
    private _maxVertices: Array<Vector2>;

    public constructor(objectToProject: Array<Vector2>, projectionAxis: Vector2) {
        this._minVertices = new Array<Vector2>();
        this._maxVertices = new Array<Vector2>();
        this.project(objectToProject, projectionAxis);

    }

    public get minProjected(): number {
        return this._minProjected;
    }

    public get maxProjected(): number {
        return this._maxProjected;
    }

    public get maxVertices(): Array<Vector2> {
        return this._maxVertices;
    }

    public get minVertices(): Array<Vector2> {
        return this._minVertices;
    }

    public distance(projected: Projected): number {
        return Math.max(projected.minProjected - this._maxProjected, this._minProjected - projected.maxProjected);
    }

    private project(vertices: Array<Vector2>, axis: Vector2): void {
        this._minProjected = vertices[0].dot(axis);
        this._maxProjected = vertices[0].dot(axis);

        for (const vertex of vertices) {
            const currProj: number = vertex.dot(axis);
            if (this._minProjected > currProj) {
                this._minProjected = currProj;
                this._minVertices = new Array<Vector2>();
                this._minVertices.push(vertex);
            } else if (currProj === this._minProjected) {
                this._minVertices.push(vertex);
            }

            if (currProj > this._maxProjected) {
                this._maxProjected = currProj;
                this._maxVertices = new Array<Vector2>();
                this._maxVertices.push(vertex);
            } else if (currProj === this._maxProjected) {
                this._maxVertices.push(vertex);
            }
        }

    }
}
