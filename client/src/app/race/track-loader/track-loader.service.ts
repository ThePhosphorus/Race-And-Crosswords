import { Injectable } from "@angular/core";
import { Vector3, Mesh, PlaneGeometry } from "three";
import { Vector3Struct, Track } from "../../../../../common/communication/track";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { BACKEND_URL, HALF, PI_OVER_2 } from "../../global-constants/constants";
import { TRACK_WIDTH } from "../race.constants";
import { WHITE_MATERIAL } from "../admin/track-editor.constants";

const TRACK_SAVER_URL: string = BACKEND_URL + "race/saver/";

@Injectable()
export class TrackLoaderService {
    public constructor(private http: HttpClient) {}

    public static toVector(vector: Vector3Struct): Vector3 {
        return new Vector3(vector.x, vector.y, vector.z);
    }

    public static getTrackMeshs(track: Track): Mesh[] {
        const meshs: Array<Mesh> = new Array<Mesh>();
        for (let i: number = 0; i < track.points.length - 1; i++) {
            meshs.push(TrackLoaderService.getRoad(
                TrackLoaderService.toVector(track.points[i]),
                TrackLoaderService.toVector(track.points[i])));
        }

        return meshs;
    }

    public static getRoad(pointA: Vector3, pointB: Vector3): Mesh {
        const vecAB: Vector3 = pointB.clone().sub(pointA);
        const distanceAB: number =  vecAB.length() + TRACK_WIDTH;
        const geo: PlaneGeometry = new PlaneGeometry(TRACK_WIDTH, distanceAB);
        geo.rotateX( - PI_OVER_2);

        const mesh: Mesh = new Mesh(geo, WHITE_MATERIAL);
        const positionOfTheRoad: Vector3 = pointA.clone().add(vecAB.clone().multiplyScalar(HALF));

        mesh.position.copy(positionOfTheRoad);
        mesh.lookAt(pointB);

        return mesh;
    }

    public loadAll(): Observable<Track[]> {
        return this.http.get<Track[]>(TRACK_SAVER_URL + "all");
    }

    public loadOne(id: string): Observable<Track> {
        return this.http.get<Track>(TRACK_SAVER_URL + id);
    }
}
