import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { Vector3Struct, Track } from "../../../../common/communication/track";
import { HttpClient } from "@angular/common/http";

const BACKEND_URL: string = "http://localhost:3000/";
const TRACK_SAVER_URL: string = BACKEND_URL + "saver/";

@Injectable()
export class TrackLoaderService {
    public constructor(private http: HttpClient) {}

    public async loadAll(): Promise<Array<Track>> {
        return this.http.get(TRACK_SAVER_URL + "all").toPromise().then((tracks: Track[]) => tracks);
    }

    public toVector(vector: Vector3Struct): Vector3 {
        return new Vector3(vector.x, vector.y, vector.z);
    }
}
