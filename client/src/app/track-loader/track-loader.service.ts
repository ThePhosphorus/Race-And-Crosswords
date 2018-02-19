import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { Vector3Struct, Track } from "../../../../common/communication/track";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

const BACKEND_URL: string = "http://localhost:3000/";
const TRACK_SAVER_URL: string = BACKEND_URL + "race/saver/";

@Injectable()
export class TrackLoaderService {
    public constructor(private http: HttpClient) {}

    public loadAll(): Observable<Track[]> {
        return this.http.get<Track[]>(TRACK_SAVER_URL + "all");
    }

    public loadOne(id: string): Observable<Track> {
        return this.http.get<Track>(TRACK_SAVER_URL + id);
    }

    public toVector(vector: Vector3Struct): Vector3 {
        return new Vector3(vector.x, vector.y, vector.z);
    }
}
