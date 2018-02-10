import * as C from "./track.constantes";
import { Mesh, Vector3, Vector2 } from "three";
import { TrackGenerator } from "./track-generator.service";

export class TrackGeneratorPointsHandler {
    private _points: Array<Mesh>;
    private _selectedPoint: number;

    public constructor(private trackGen: TrackGenerator) {
        this._points = new Array<Mesh>();
        this._selectedPoint = -1;
    }

    public get length(): number {
        return this._points.length;
    }

    public get top(): Mesh {
        return this._points[this.length - 1];
    }

    public get points(): Array<Mesh> { // TODO remove this function after refactoring the rest of the code
        return this._points;
    }

    public get PositionSelectPoints(): C.PosSelect[] {
        const result: C.PosSelect[] = [];
        for (let i: number = 0 ; i < this.length; i++) {
            result.push(new C.PosSelect(this.toVector2(this._points[i].position), i === this._selectedPoint));
        }

        return result;
    }

    public get selectedPointId(): number {
        return this._selectedPoint;
    }

    public pointSelected(): boolean {
        return this._selectedPoint !== -1;
    }

    public point(index: number): Mesh {
        return this._points[index];
    }

    public selectPoint(pointId: number): void {
        if ( this._selectedPoint > 0) {
            this.point(this._selectedPoint).material = C.WHITE_MATERIAL;
        }
        if (pointId === 0 && !this.top.position.equals(this._points[0].position)) {
            this.closeLoop();
        }

        this._selectedPoint = pointId;
        this.point(pointId).material = C.SELECTION_MATERIAL;

    }

    public removePoint(index: number): void {
        if (index === this._selectedPoint) {
            this._selectedPoint = -1;
        } else if (index < this._selectedPoint) {
            this._selectedPoint--;
        }

        this.trackGen.removeObject(this._points[index], this._points[index - 1], this._points[index + 1]);
        this._points.splice(index, 1);
    }

    public push(mesh: Mesh): void {
        this._points.push(mesh);
    }

    public updateStartingPosition(): void {
        if (this._points[0]) {
            this._points[0].material = C.START_POINT_MATERIAL;
        }
    }

    private toVector2(v: Vector3): Vector2 {
        return new Vector2(v.x, v.z);
    }

    private closeLoop(): void {
        this.push(this.trackGen.createDot(
            this.trackGen.getClientPosition(this._points[0].position),
            this.top.position));
    }

}
