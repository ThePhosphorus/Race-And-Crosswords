import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { Track, Vector3Struct } from "../../../../common/communication/track";

@Injectable()
export class TrackSaverService {
    public constructor() {}

    public getTrack(name: string, description: string, points: Vector3[]): Track {
        const track: Track = new Track(
            name,
            description,
            new Array<Vector3Struct>()
        );

        points.forEach((point: Vector3) => {
            track.points.push(this.toVectorStruct(point));
        });

        return track;
    }

    public toVectorStruct(vector: Vector3): Vector3Struct {
        return new Vector3Struct(vector.x, vector.y, vector.z);
    }
}
