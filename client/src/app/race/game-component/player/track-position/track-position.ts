import { Vector3 } from "three";

export class TrackPosition {
    private distances: Array<number>;

    public constructor(private track: Array<Vector3>) {
        if (this.track == null) {
            this.track = new Array<Vector3>();
        }
        this.distances = new Array<number>();
        this.distances.push(0);
        for (let i: number = 1; i < track.length; i++) {
            const point: Vector3 = track[i];
            const previous: Vector3 = track[i - 1];
            this.distances.push(point.clone().sub(previous).length() + this.distances[i - 1]);
        }
    }

    public get length(): number {
        return this.track.length;
    }

    public get trackLength(): number {
        return this.distances[this.distances.length - 1];
    }

    public getPoint(index: number): Vector3 {
        return this.track[index];
    }

    public getSurroundingPoint(pointIndex: number, offsetIndex: number): Vector3 {
        return this.track[this.getSurroundingPointIndex(pointIndex, offsetIndex)];
    }

    public getSurroundingPointIndex(pointIndex: number, offsetIndex: number): number {
        return (pointIndex + offsetIndex + this.track.length) % this.track.length;
    }

    public findDistanceOnTrack(position: Vector3): number {
        const p2Index: number = this.findClosestNextPointIndex(position);
        const p1Index: number = this.getSurroundingPointIndex(p2Index, -1);
        const p1: Vector3 = this.getPoint(p1Index);
        const p2: Vector3 = this.getPoint(p2Index);

        const line: Vector3 = p2.clone().sub(p1);
        const distanceToPoint: number = position.clone().sub(p1).projectOnVector(line).length();

        return this.distances[p1Index] + distanceToPoint;
    }

    public findClosestNextPointIndex(position: Vector3): number {
        let minDistance: number = Number.MAX_VALUE;
        let point: number = 0;
        for (let i: number = 0; i < this.track.length; i++) {
            const nextIndex: number = (i === this.track.length - 1) ? 1 : i + 1;
            const p1: Vector3 = this.track[i];
            const p2: Vector3 = this.track[nextIndex];
            const dotProduct: number = p2.clone().sub(p1).dot(position.clone().sub(p1));
            const isContainedInLine: boolean = dotProduct > 1 && dotProduct < p2.clone().sub(p1).lengthSq();
            const distance: number = isContainedInLine ? this.distanceToLine(p1, p2, position) : position.clone().sub(p1).length();

            if (distance < minDistance) {
                point = nextIndex;
                minDistance = distance;
            }
        }

        return point;
    }

    private distanceToLine(p1: Vector3, p2: Vector3, pos: Vector3): number {
        return Math.abs((p2.z - p1.z) * pos.x - (p2.x - p1.x) * pos.z + p2.x * p1.z - p2.z * p1.x) /
            p1.clone().distanceTo(p2);
    }
}
