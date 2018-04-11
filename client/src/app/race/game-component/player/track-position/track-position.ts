import { Vector3 } from "three";

export class TrackPosition {
    private distances: Array<number>;

    public constructor(private track: Array<Vector3>) {
        this.distances = new Array<number>();
        this.distances.push(0);
        for (let i: number = 1; i < track.length; i++) {
            const point: Vector3 = track[i];
            const previous: Vector3 = track[i - 1];
            this.distances.push(point.clone().sub(previous).length());
        }
    }

    public get length(): number {
        return this.track.length;
    }

    public getPoint(index: number): Vector3 {
        return this.track[index];
    }

    public getSurroundingPoint(pointIndex: number, offsetIndex: number): Vector3 {
        return this.track[(pointIndex + offsetIndex + this.track.length) % this.track.length];
    }

    public findDistanceOnTrack(position: Vector3): number {
        return 0;
    }

    public findClosestNextPoint(position: Vector3): Vector3 {
        return this.track[this.findClosestNextPointIndex(position)];
    }

    public findClosestNextPointIndex(position: Vector3): number {
        return 0;
    }
}
