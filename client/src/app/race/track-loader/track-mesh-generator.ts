import { Track } from "../../../../../common/race/track";
import { Vector3, Geometry, Face3, Mesh, CubicBezierCurve3 } from "three";
import { LengthMismatchException } from "../../exceptions/length-mismatch-exception";
import { DOUBLE, HALF } from "../../global-constants/constants";
import { WHITE_MATERIAL } from "../admin/track-editor.constants";
import { TrackLoaderService } from "./track-loader.service";
import { DEFAULT_TRACK_WIDTH } from "../race.constants";

const NB_SMOOTHING_VERTECIES: number = 5;

export class TrackMeshGenerator {
    private _length: number;
    private _geometry: Geometry;

    public constructor (private _track: Track) {
        this._geometry = new Geometry();
        this._length = 0;

        this.initMeshInfos();
    }

    private initMeshInfos(): void {
        this.generatePoints();
        this.smoothEdges();
        this.linkPoints();
    }

    private generatePoints(): void {
        const leftPoints: Array<Vector3> = new Array<Vector3>();
        const rightPoints: Array<Vector3> = new Array<Vector3>();

        for (let i: number = 0; i < this._track.points.length - 1; i++) {
            const p0Index: number = (i - 1) === -1 ? (this._track.points.length - 2) : (i - 1);
            const p0: Vector3 = TrackLoaderService.toVector(this._track.points[p0Index]); // Previous
            const p1: Vector3 = TrackLoaderService.toVector(this._track.points[i]);
            const p2: Vector3 = TrackLoaderService.toVector(this._track.points[i + 1]); // Next
            rightPoints.push(this.getCornerPoint(p0, p1, p2, -1));
            leftPoints.push(this.getCornerPoint(p0, p1, p2, 1));
        }

        this.fillVertecies(leftPoints, rightPoints);

    }

    private getCornerPoint(pointP: Vector3, pointA: Vector3, pointB: Vector3, relativeOffset: number): Vector3 {
        const vecPA: Vector3 = pointA.clone().sub(pointP);
        const vecAB: Vector3 = pointB.clone().sub(pointA);

        const perpAB: Vector3 = new Vector3(vecAB.z, vecAB.y, -vecAB.x).normalize()
            .multiplyScalar((DEFAULT_TRACK_WIDTH * HALF) * relativeOffset);
        const perpPA: Vector3 = new Vector3(vecPA.z, vecPA.y, -vecPA.x).normalize()
            .multiplyScalar((DEFAULT_TRACK_WIDTH * HALF) * relativeOffset);

        const innerPoint: Vector3 = this.findIntersection(pointP.clone().add(perpPA), pointA.clone().add(perpPA),
                                                          pointA.clone().add(perpAB), pointB.clone().add(perpAB));

        if (relativeOffset > 0) {
            const inner: Vector3 = this.getCornerPoint(pointP, pointA, pointB, - relativeOffset);
            const normal: Vector3 = inner.clone().sub(innerPoint);
            const offset: number = normal.length() - DEFAULT_TRACK_WIDTH;

            return innerPoint.add(normal.normalize().multiplyScalar(offset));

        } else {
            return innerPoint;
        }
    }

    private findIntersection(p1: Vector3, p2: Vector3, p3: Vector3, p4: Vector3): Vector3 {
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

    private smoothEdges(): void {
        let rightVertecies: Array<Vector3> = new Array<Vector3>();
        let leftVertecies: Array<Vector3> = new Array<Vector3>();

        for (let i: number = 0; i < this._track.points.length - 1; i++) {
            const p0Index: number = (i - 1) === -1 ? (this._track.points.length - 2) : (i - 1);
            const p0: Vector3 = TrackLoaderService.toVector(this._track.points[p0Index]); // Previous
            const p1: Vector3 = TrackLoaderService.toVector(this._track.points[i]);
            const p2: Vector3 = TrackLoaderService.toVector(this._track.points[i + 1]); // Next

            rightVertecies = rightVertecies.concat(this.smoothEdge(p1, p2, p0, this.getRightPoint(i)));
            leftVertecies = leftVertecies.concat(this.smoothEdge(p1, p2, p0, this.getLeftPoint(i)));
        }

        this.fillVertecies(leftVertecies, rightVertecies);
    }

    private smoothEdge(pointP: Vector3, pointA: Vector3, pointB: Vector3, edgeId: number): Array<Vector3> {
        const PB: Vector3 = pointB.clone().sub(pointP).normalize().multiplyScalar(DEFAULT_TRACK_WIDTH);
        const PA: Vector3 = pointA.clone().sub(pointP).normalize().multiplyScalar(DEFAULT_TRACK_WIDTH);

        const edge: Vector3 = this._geometry.vertices[edgeId];

        const p0: Vector3 = edge.clone().add(PB);
        const p1: Vector3 = edge.clone().add(PB.clone().multiplyScalar(HALF));
        const p2: Vector3 = edge.clone().add(PA.clone().multiplyScalar(HALF));
        const p3: Vector3 = edge.clone().add(PA);

        const arc: CubicBezierCurve3 = new CubicBezierCurve3(p0, p1, p2, p3);

        return arc.getPoints(NB_SMOOTHING_VERTECIES);

    }

    private fillVertecies(leftArray: Array<Vector3>, rightArray: Array<Vector3>): void {
        if (leftArray.length !== rightArray.length) {
            throw new LengthMismatchException();
        } else {
            this._length = leftArray.length;
        }

        this._geometry.vertices = new Array<Vector3>();

        for (let i: number = 0; i < this.nbPoints; i++) {
            this._geometry.vertices.push(leftArray[i]);
            this._geometry.vertices.push(rightArray[i]);
        }
    }

    private linkPoints(): void {

        const vecUp: Vector3 = new Vector3(0, 1, 0);
        for (let i: number = 0; i < this.nbPoints; i++) {
            this._geometry.faces.push(new Face3(this.getRightPoint(i), this.getLeftPoint(i + 1), this.getLeftPoint(i), vecUp));
            this._geometry.faces.push(new Face3(this.getRightPoint(i), this.getRightPoint(i + 1), this.getLeftPoint(i + 1), vecUp));
        }

        this._geometry.computeBoundingSphere();
    }

    private get nbPoints(): number {
        return this._length;
    }

    private getRightPoint(index: number): number {
        return DOUBLE * (index % this.nbPoints) + 1;
    }

    private getLeftPoint(index: number): number {
        return DOUBLE * (index % this.nbPoints);
    }

    public get newMesh(): Mesh {
        return new Mesh(this._geometry, WHITE_MATERIAL);
    }

    public get track(): Track {
        return this._track;
    }

}
