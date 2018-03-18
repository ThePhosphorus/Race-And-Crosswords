import { Vector2 } from "three";

export class Projected {
    private _minProjected: number;
    private _maxProjected: number;
    private _minVertex: Vector2;
    private _maxVertex: Vector2;

    public constructor(objectToProject: Array<Vector2>, projectionAxis: Vector2) {
        this.project(objectToProject, projectionAxis);
    }
    public get minProjected(): number {
        return this._minProjected;
    }
    public get maxProjected(): number {
        return this._maxProjected;
    }
    public get minVertex(): Vector2 {
        return this._minVertex;
    }
    public get maxVertex(): Vector2 {
        return this._maxVertex;
    }
    public isDisjoint(projected: Projected): boolean {
        return this._maxProjected < projected.minProjected || projected.maxProjected < this._minProjected;
    }
    private project(vertexes: Array<Vector2>, axis: Vector2): void {
        this._minProjected = Number.MAX_VALUE;
        this._maxProjected = Number.MIN_VALUE;

        for (const vertex of vertexes) {
            const currProj: number = vertex.dot(axis);
            if (this._minProjected > currProj) {
                this._minProjected = currProj;
                this._minVertex = vertex;
            } else if (currProj > this._maxProjected) {
                this._maxProjected = currProj;
                this._maxVertex = vertex;
            }
        }

    }
}
