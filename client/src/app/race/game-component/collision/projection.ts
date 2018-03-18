import { Vector2 } from "three";

export class Projected {
    private _minProjected: number;
    private _maxProjected: number;

    public constructor(objectToProject: Array<Vector2>, projectionAxis: Vector2) {
        this.project(objectToProject, projectionAxis);
    }

    public get minProjected(): number {
        return this._minProjected;
    }

    public get maxProjected(): number {
        return this._maxProjected;
    }

    public distance(projected: Projected): number {
        return Math.max(projected.minProjected - this._maxProjected, this._minProjected - projected.maxProjected);
    }

    private project(vertexes: Array<Vector2>, axis: Vector2): void {
        this._minProjected = Number.MAX_VALUE;
        this._maxProjected = Number.MIN_VALUE;

        for (const vertex of vertexes) {
            const currProj: number = vertex.dot(axis);
            if (this._minProjected > currProj) {
                this._minProjected = currProj;
            } else if (currProj > this._maxProjected) {
                this._maxProjected = currProj;
            }
        }

    }
}
