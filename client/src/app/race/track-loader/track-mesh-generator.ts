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
        this.linkPoints();
    }

    private generatePoints(): void {
        const leftPoints: Array<Vector3> = new Array<Vector3>();
        const rightPoints: Array<Vector3> = new Array<Vector3>();

        for (let i: number = 0; i < this._track.points.length - 1; i++) {
            const p3Index: number = (i + 2) === this._track.points.length ? 1 : (i + 2);
            const p0Index: number = (i - 1) === -1 ? (this._track.points.length - 2) : (i - 1);
            const p0: Vector3 = TrackLoaderService.toVector(this._track.points[p0Index]); // Previous
            const p1: Vector3 = TrackLoaderService.toVector(this._track.points[i]);
            const p2: Vector3 = TrackLoaderService.toVector(this._track.points[i + 1]);
            const p3: Vector3 = TrackLoaderService.toVector(this._track.points[p3Index]); // Next
            rightPoints.push(this.getSegmentWall(p0, p1, p2, p3, -1));
            leftPoints.push(this.getSegmentWall(p0, p1, p2, p3, 1));
        }

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

    private  getSegmentWall(pointP: Vector3, pointA: Vector3, pointB: Vector3, pointN: Vector3, relativeOffset: number): Vector3 {
        const vecPA: Vector3 = pointA.clone().sub(pointP);
        const vecAB: Vector3 = pointB.clone().sub(pointA);
        const vecBN: Vector3 = pointN.clone().sub(pointB);

        const perpAB: Vector3 = new Vector3(vecAB.z, vecAB.y, -vecAB.x).normalize()
            .multiplyScalar((DEFAULT_TRACK_WIDTH * HALF) * relativeOffset);
        const perpPA: Vector3 = new Vector3(vecPA.z, vecPA.y, -vecPA.x).normalize()
            .multiplyScalar((DEFAULT_TRACK_WIDTH * HALF) * relativeOffset);
        const perpBN: Vector3 = new Vector3(vecBN.z, vecBN.y, -vecBN.x).normalize()
            .multiplyScalar((DEFAULT_TRACK_WIDTH * HALF) * relativeOffset);

        return this.findIntersection(pointP.clone().add(perpPA), pointA.clone().add(perpPA),
                                     pointA.clone().add(perpAB), pointB.clone().add(perpAB));
    }

    private  findIntersection(p1: Vector3, p2: Vector3, p3: Vector3, p4: Vector3): Vector3 {
        if (p2.equals(p3)) {
            return p2.clone();
        }
        const x1: number = p1.x;
        const y1: number = p1.z;
        const x2: number = p2.x;
        const y2: number = p2.z;
        const x3: number = p3.x;
        const y3: number = p3.z;
        const x4: number = p4.x;
        const y4: number = p4.z;
        const intersectionX: number = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
                                      ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        const intersectionY: number = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
                                      ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

        return new Vector3(intersectionX, p1.y, intersectionY);
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
