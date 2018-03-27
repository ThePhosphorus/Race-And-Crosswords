import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { Track } from "../../../../../../common/race/track";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { BACKEND_URL } from "../../../global-constants/constants";
import { Vector3Struct } from "../../../../../../common/race/vector3-struct";

const TRACK_SAVER_URL: string = BACKEND_URL + "race/saver/";

interface MongoObj {
    n: number;
}

@Injectable()
export class TrackSaverService {

    public constructor(private http: HttpClient) {}

    public save(id: string, name: string, description: string, points: Vector3[]): Observable<boolean> {
        const track: Track = this.getTrack(id, name, description, points);
        const requestHeader: HttpHeaders = new HttpHeaders({"Content-Type": "application/json"});

        if (track._id) {
            return this.http.put(TRACK_SAVER_URL + id, { track : track}, { headers : requestHeader}).map((obj: MongoObj) => obj.n > 0);
        } else {
            return this.http.post(TRACK_SAVER_URL, {track : track}, { headers : requestHeader}).map((obj: MongoObj) => obj.n > 0);
        }

    }

    public delete(id: string): Observable<boolean> {
        return this.http.delete(TRACK_SAVER_URL + id).map((obj: MongoObj) => obj.n > 0);
    }

    public getTrack(id: string, name: string, description: string, points: Vector3[]): Track {
        const track: Track = new Track(
            id,
            name,
            description,
            new Array<Vector3Struct>(),
            0
        );

        points.forEach((point: Vector3) => {
            track.points.push(point);
        });

        return track;
    }
}
