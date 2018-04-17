import { Injectable } from "@angular/core";
import { Vector3, Mesh, Object3D } from "three";
import { Track } from "../../../../../common/race/track";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { BACKEND_URL } from "../../global-constants/constants";
import { Vector3Struct } from "../../../../../common/race/vector3-struct";
import { Highscore } from "../../../../../common/race/highscore";
import { TrackMeshGenerator } from "./track-mesh-generator";

const TRACK_SAVER_URL: string = BACKEND_URL + "race/saver/";
const TRACK_SAVER_INCPLAY_URL: string = TRACK_SAVER_URL + "play/";
const TRACK_SAVER_UPDATE_HIGHSCORE: string = TRACK_SAVER_URL + "highscore/";

@Injectable()
export class TrackLoaderService {
    public constructor(private _http: HttpClient) {}

    public static toVector(vector: Vector3Struct): Vector3 {
        return new Vector3(vector.x, vector.y, vector.z);
    }

    public static toVectors(vectors: Array<Vector3Struct>): Array<Vector3> {
        const vectorArr: Array<Vector3> = new Array<Vector3>();
        vectors.forEach((vec) => vectorArr.push(TrackLoaderService.toVector(vec)));

        return vectorArr;
    }

    public getTrackMeshs(track: Track): Mesh[] {
        const meshs: Array<Mesh> = new Array<Mesh>();

        const generator: TrackMeshGenerator = new TrackMeshGenerator(track);

        meshs.push(generator.newMesh);
        meshs.push(generator.startMesh);

        return meshs;
    }

    public  getTrackWalls(track: Track): Array<Object3D> {
        const generator: TrackMeshGenerator = new TrackMeshGenerator(track);

        return generator.generateWalls();
    }

    public loadAll(): Observable<Track[]> {
        return this._http.get<Track[]>(TRACK_SAVER_URL + "all");
    }

    public loadOne(id: string): Observable<Track> {
        return this._http.get<Track>(TRACK_SAVER_URL + id);
    }

    public playTrack(id: string): Observable<void> {
        return this._http.put<void>(TRACK_SAVER_INCPLAY_URL + id, null);
    }

    public updateHighScore(id: string, score: Highscore): Observable<void> {
        return this._http.put<void>(TRACK_SAVER_UPDATE_HIGHSCORE + id, { highscore : score });
    }
}
