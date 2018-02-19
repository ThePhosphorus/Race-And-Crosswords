import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { Track, Vector3Struct } from "../../../../common/communication/track";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

const BACKEND_URL: string = "http://localhost:3000/";
const TRACK_SAVER_URL: string = BACKEND_URL + "race/saver/";

@Injectable()
export class TrackSaverService {

    public constructor(private http: HttpClient) {}

    public save(id: string, name: string, description: string, points: Vector3[]): Observable<boolean> {
        const track: Track = this.getTrack(id, name, description, points);
        const requestHeader: HttpHeaders = new HttpHeaders({"Content-Type": "application/json"});

        if (track._id) {
            return this.http.put<Track>(TRACK_SAVER_URL + id, { track : track}, { headers : requestHeader}).map((obj) => obj.n);
        } else {
            return this.http.post<Track>(TRACK_SAVER_URL, {track : track}, { headers : requestHeader}).map((obj) => obj.n);
        }

    }

    public delete(id: string): Observable<boolean> {
        return this.http.delete(TRACK_SAVER_URL + id).map((obj) => obj.n);
    }

    public getTrack(id: string, name: string, description: string, points: Vector3[]): Track {
        const track: Track = new Track(
            id,
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
