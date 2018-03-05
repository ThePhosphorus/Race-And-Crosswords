import { Injectable } from "@angular/core";
import { Vector3, Mesh, PlaneGeometry, TextureLoader, Texture, RepeatWrapping, MeshLambertMaterial, DoubleSide } from "three";
import { Vector3Struct, Track } from "../../../../../common/communication/track";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { BACKEND_URL, HALF, PI_OVER_2 } from "../../global-constants/constants";
import { TRACK_WIDTH } from "../race.constants";

const TRACK_PATH: string = "../../assets/textures/floor.jpg";
const TRACK_SAVER_URL: string = BACKEND_URL + "race/saver/";
const FLOOR_RATIO: number = 0.1;

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

    public static getTrackMaterial(length: number): MeshLambertMaterial {
        const texture: Texture = new TextureLoader().load(TRACK_PATH);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(TRACK_WIDTH * FLOOR_RATIO, length * FLOOR_RATIO);

        return new MeshLambertMaterial({ map: texture, side: DoubleSide });
    }

    public static getRoad(pointA: Vector3, pointB: Vector3): Mesh {
        const vecAB: Vector3 = pointB.clone().sub(pointA);
        const distanceAB: number =  vecAB.length() + TRACK_WIDTH;
        const geo: PlaneGeometry = new PlaneGeometry(TRACK_WIDTH, distanceAB);
        geo.rotateX( - PI_OVER_2);

        const mesh: Mesh = new Mesh(geo, TrackLoaderService.getTrackMaterial(distanceAB));
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
