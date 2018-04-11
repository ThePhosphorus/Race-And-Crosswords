import { Track } from "../../../../../common/race/track";
import { Vector3, Geometry, Face3, Mesh } from "three";
import { LengthMismatchException } from "../../exceptions/length-mismatch-exception";
import { DOUBLE } from "../../global-constants/constants";
import { WHITE_MATERIAL } from "../admin/track-editor.constants";
import { Vector3Struct } from "../../../../../common/race/vector3-struct";
import { TrackLoaderService } from "./track-loader.service";

export class TrackMeshGenerator {
    private _length: number;
    private _geometry: Geometry;

    public constructor (private _track: Track) {
        this._geometry = new Geometry();
        this._length = 0;

        this.generatePoints();
        this.linkPoints();
    }

    private generatePoints(): void {
        const leftPoints: Array<Vector3> = new Array<Vector3>();
        const rightPoints: Array<Vector3> = new Array<Vector3>();

        this._track.points.forEach(( point: Vector3Struct, index: number ) => {
            const vecUp: Vector3 = new Vector3(0, 1, 0);
            const pointA: Vector3 = TrackLoaderService.toVector(point);
            const pointB: Vector3 = TrackLoaderService.toVector(this._track.points[(index + 1 ) % this._track.points.length]);

            const direction: Vector3 = pointB.clone().sub(pointA);
            const rightVec: Vector3 = direction.clone().cross(vecUp);
            const leftVec: Vector3 = vecUp.clone().cross(direction);

            rightPoints.push(pointA.clone().add(rightVec));
            leftPoints.push(pointA.clone().add(leftVec));

        });

        if (leftPoints.length !== rightPoints.length) {
            throw new LengthMismatchException();
        } else {
            this._length = leftPoints.length;
        }

        for (let i: number = 0; i < this.nbPoints; i++) {
            this._geometry.vertices.push(leftPoints[i]);
            this._geometry.vertices.push(rightPoints[i]);
        }
    }

    private linkPoints(): void {
        for (let i: number = 0; i < this.nbPoints; i++) {
            this._geometry.faces.push(new Face3(this.getLeftPoint(i), this.getRightPoint(i + 1), this.getRightPoint(i)));
            this._geometry.faces.push(new Face3(this.getLeftPoint(i), this.getLeftPoint(i + 1), this.getRightPoint(i)));
        }
    }

    private get nbPoints(): number {
        return this._length;
    }

    private getLeftPoint(index: number): number {
        return DOUBLE * (index % this.nbPoints);
    }

    private getRightPoint(index: number): number {
        return DOUBLE * (index % this.nbPoints) + 1;
    }

    public get newMesh(): Mesh {
        return new Mesh(this._geometry, WHITE_MATERIAL);
    }

    public get track(): Track {
        return this._track;
    }

}
