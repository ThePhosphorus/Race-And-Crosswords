import { Vector2 } from "three";

export class Projected {
    private _minProjected: number;
    private _maxProjected: number;
    private _minVertexes: Array<Vector2>;
    private _maxVertexes: Array<Vector2>;

    public constructor(objectToProject: Array<Vector2>, projectionAxis: Vector2) {
        this._minVertexes = new Array<Vector2>();
        this._maxVertexes = new Array<Vector2>();
        this.project(objectToProject, projectionAxis);

    }

    public get minProjected(): number {
        return this._minProjected;
    }

    public get maxProjected(): number {
        return this._maxProjected;
    }

    public get maxVertexes(): Array<Vector2> {
        return this._maxVertexes;
    }

    public get minVertexes(): Array<Vector2> {
        return this._minVertexes;
    }

    public distance(projected: Projected): number {
        return Math.max(projected.minProjected - this._maxProjected, this._minProjected - projected.maxProjected);
    }

    private project(vertexes: Array<Vector2>, axis: Vector2): void {
        this._minProjected = vertexes[0].dot(axis);
        this._maxProjected = vertexes[0].dot(axis);

        for (const vertex of vertexes) {
            const currProj: number = vertex.dot(axis);
            if (this._minProjected > currProj) {
                this._minProjected = currProj;
                this._minVertexes = new Array<Vector2>();
                this._minVertexes.push(vertex);
            } else if (currProj === this._minProjected) {
                this._minVertexes.push(vertex);
            }

            if (currProj > this._maxProjected) {
                this._maxProjected = currProj;
                this._maxVertexes = new Array<Vector2>();
                this._maxVertexes.push(vertex);
            } else if (currProj === this._maxProjected) {
                this._maxVertexes.push(vertex);
            }
        }

    }
}
