import { Injectable } from "@angular/core";
import { Vector3, Mesh, PlaneGeometry, TextureLoader,
    Texture, RepeatWrapping, DoubleSide, CircleGeometry, MeshPhongMaterial, Material
} from "three";
import { Vector3Struct, Track } from "../../../../../common/communication/track";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { BACKEND_URL, HALF, PI_OVER_2, DOUBLE, TRIPLE } from "../../global-constants/constants";
import { DEFAULT_TRACK_WIDTH } from "../race.constants";

const TRACK_PATH: string = "../../assets/textures/test.jpg";
const LINE_PATH: string = "../../assets/textures/linefixed.bmp";
const TRACK_SAVER_URL: string = BACKEND_URL + "race/saver/";
const FLOOR_RATIO: number = 0.1;
const Y_OFFSET: number = 0.00001;
const CORNER_NB_SEGMENTS: number = 20;

@Injectable()
export class TrackLoaderService {
    public constructor(private http: HttpClient) {}

    public static toVector(vector: Vector3Struct): Vector3 {
        return new Vector3(vector.x, vector.y, vector.z);
    }

    public static getTrackMeshs(track: Track): Mesh[] {
        const meshs: Array<Mesh> = new Array<Mesh>();
        const startMesh: Mesh =
        TrackLoaderService.getStartMesh(
            TrackLoaderService.toVector(track.points[0]),
            TrackLoaderService.toVector(track.points[1])
           );
        meshs.push(startMesh);
        for (let i: number = 0; i < track.points.length - 1; i++) {
            const roadMesh: Mesh = TrackLoaderService.getRoad(
                TrackLoaderService.toVector(track.points[i]),
                TrackLoaderService.toVector(track.points[i + 1]));
            if (i === 0) {
                 roadMesh.position.setY(DOUBLE * Y_OFFSET);
            } else if (i % DOUBLE) { roadMesh.position.setY(Y_OFFSET); }
            meshs.push(roadMesh);

            meshs.push(TrackLoaderService.getCornerAprox(
                TrackLoaderService.toVector(track.points[i]),
                TrackLoaderService.toVector(track.points[(i === 0) ? track.points.length - 1 : i - 1]),
                TrackLoaderService.toVector(track.points[(i === track.points.length - 1) ? 0 : i + 1])
            ));
        }

        return meshs;
    }

    public static getTrackMaterial(width: number, length: number): MeshPhongMaterial {
        const texture: Texture = new TextureLoader().load(TRACK_PATH);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(width * FLOOR_RATIO, length * FLOOR_RATIO);
        return new MeshPhongMaterial({ map: texture, side: DoubleSide });
    }
    public static getFinishLineMaterial(width: number, length: number): MeshPhongMaterial {
        const texture: Texture = new TextureLoader().load(LINE_PATH);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(width , length / 4);
        const mat: MeshPhongMaterial = new MeshPhongMaterial({ map: texture, side: DoubleSide });
        mat.transparent = true;
        mat.opacity = 0.2;

        return mat;
    }

    public static getCornerAprox(center: Vector3, before: Vector3, after: Vector3): Mesh {
        const circleGeo: CircleGeometry =  new CircleGeometry(HALF * DEFAULT_TRACK_WIDTH, CORNER_NB_SEGMENTS);
        circleGeo.rotateX( - PI_OVER_2);
        const circleMesh: Mesh = new Mesh( circleGeo, TrackLoaderService.getTrackMaterial(DEFAULT_TRACK_WIDTH, DEFAULT_TRACK_WIDTH));
        circleMesh.position.copy(new Vector3(center.x, center.y + TRIPLE * Y_OFFSET, center.z));
        circleMesh.receiveShadow = true;

        return circleMesh;
    }
    public static getStartMesh(point: Vector3, pointB: Vector3, width?: number): Mesh {
        const geo: PlaneGeometry = new PlaneGeometry(DEFAULT_TRACK_WIDTH, DEFAULT_TRACK_WIDTH/4);
        geo.rotateX( - PI_OVER_2);

        const mesh: Mesh = new Mesh(geo, TrackLoaderService.getFinishLineMaterial(DEFAULT_TRACK_WIDTH, DEFAULT_TRACK_WIDTH));

        mesh.position.copy(point);
        mesh.position.setY(0.02);
        mesh.lookAt(pointB);

        mesh.receiveShadow = true;

        return mesh;
    }

    public static getRoad(pointA: Vector3, pointB: Vector3, width?: number): Mesh {
        const trackWidth: number = width ? width : DEFAULT_TRACK_WIDTH;
        const vecAB: Vector3 = pointB.clone().sub(pointA);
        const distanceAB: number =  vecAB.length();
        const geo: PlaneGeometry = new PlaneGeometry(trackWidth, distanceAB);
        geo.rotateX( - PI_OVER_2);

        const mesh: Mesh = new Mesh(geo, TrackLoaderService.getTrackMaterial(trackWidth, distanceAB));
        const positionOfTheRoad: Vector3 = pointA.clone().add(vecAB.clone().multiplyScalar(HALF));

        mesh.position.copy(positionOfTheRoad);
        mesh.position.setY(0);
        mesh.lookAt(pointB);

        mesh.receiveShadow = true;

        return mesh;
    }

    public loadAll(): Observable<Track[]> {
        return this.http.get<Track[]>(TRACK_SAVER_URL + "all");
    }

    public loadOne(id: string): Observable<Track> {
        return this.http.get<Track>(TRACK_SAVER_URL + id);
    }
}
