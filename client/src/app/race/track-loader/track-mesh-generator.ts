import { Track } from "../../../../../common/race/track";
import { Vector3, Geometry, Face3, Mesh } from "three";
import { LengthMismatchException } from "../../exceptions/length-mismatch-exception";
import { DOUBLE, HALF } from "../../global-constants/constants";
import { WHITE_MATERIAL } from "../admin/track-editor.constants";
import { Vector3Struct } from "../../../../../common/race/vector3-struct";
import { TrackLoaderService } from "./track-loader.service";
import { DEFAULT_TRACK_WIDTH } from "../race.constants";

export class TrackMeshGenerator {
    private _length: number;
    private _geometry: Geometry;

    public constructor (private _track: Track) {
        this._geometry = new Geometry();
        this._length = 0;

        this.generatePoints();

        // this._geometry.vertices.push(new Vector3(0, 0, 0));
        // this._geometry.vertices.push(new Vector3(0, 0, 10));

        // this._geometry.vertices.push(new Vector3(10, 0, 0));
        // this._geometry.vertices.push(new Vector3(10, 0, 10));

        // this._geometry.vertices.push(new Vector3(20, 0, 0));
        // this._geometry.vertices.push(new Vector3(20, 0, 10));

        // this._geometry.vertices.push(new Vector3(30, 0 , 10));
        // this._geometry.vertices.push(new Vector3(30, 0 , 20));
        // this._length = 4;

        this.linkPoints();
    }

    private generatePoints(): void {
        const leftPoints: Array<Vector3> = new Array<Vector3>();
        const rightPoints: Array<Vector3> = new Array<Vector3>();

        this._track.points.forEach(( point: Vector3Struct, index: number ) => {
            const vecUp: Vector3 = new Vector3(0, 1, 0);
            const pointCurrent: Vector3 = TrackLoaderService.toVector(this._track.points[index]);
            const pointAfter: Vector3 = TrackLoaderService.toVector(this._track.points[(index + 1 ) % this._track.points.length]);
            const pointBefore: Vector3 = TrackLoaderService.toVector(this._track.points[(index + this._track.points.length - 2 ) % this._track.points.length]);
            console.log((index - 1 ) % this._track.points.length);

            const direction: Vector3 = pointAfter.clone().sub(pointCurrent).add( pointCurrent.clone().sub(pointBefore));
            const rightVec: Vector3 = direction.clone().cross(vecUp).normalize().multiplyScalar( HALF * DEFAULT_TRACK_WIDTH);
            const leftVec: Vector3 = vecUp.clone().cross(direction).normalize().multiplyScalar( HALF * DEFAULT_TRACK_WIDTH);

            rightPoints.push(pointCurrent.clone().add(rightVec));
            leftPoints.push(pointCurrent.clone().add(leftVec));

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

    private generatesidePoints() {
        
    }

    private linkPoints(): void {

        const vecUp: Vector3 = new Vector3(0, 1, 0);
        for (let i: number = 0; i < this.nbPoints; i++) {
            console.log(this.getRightPoint(i));

            console.log("left", this._geometry.vertices[this.getLeftPoint(i)]);
            console.log("right", this._geometry.vertices[this.getRightPoint(i)]);

            this._geometry.faces.push(new Face3(this.getLeftPoint(i), this.getRightPoint(i + 1), this.getRightPoint(i), vecUp));
            this._geometry.faces.push(new Face3(this.getLeftPoint(i), this.getLeftPoint(i + 1), this.getRightPoint(i + 1), vecUp));
        }
        console.log(this._geometry.faces);

        this._geometry.computeBoundingSphere();
    }

    private get nbPoints(): number {
        return this._length;
    }

    private getLeftPoint(index: number): number {
        return DOUBLE * (index % this.nbPoints) + 1;
    }

    private getRightPoint(index: number): number {
        return DOUBLE * (index % this.nbPoints);
    }

    public get newMesh(): Mesh {
        return new Mesh(this._geometry, WHITE_MATERIAL);
    }

    public get track(): Track {
        return this._track;
    }

}
