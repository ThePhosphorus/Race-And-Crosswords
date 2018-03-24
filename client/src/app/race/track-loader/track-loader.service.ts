import { Injectable } from "@angular/core";
import { Vector3, Mesh, PlaneGeometry, TextureLoader,
    Texture, RepeatWrapping, DoubleSide, CircleGeometry, MeshPhongMaterial, Object3D
} from "three";
import { Vector3Struct, Track } from "../../../../../common/communication/track";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { BACKEND_URL, HALF, PI_OVER_2, DOUBLE, TRIPLE } from "../../global-constants/constants";
import { DEFAULT_TRACK_WIDTH, DEFAULT_MASS } from "../race.constants";
import { Collider } from "../game-component/collision/collider";
import { RigidBody } from "../game-component/rigid-body/rigid-body";

const TRACK_PATH: string = "../../assets/textures/test.jpg";
const LINE_PATH: string = "../../assets/textures/linefixed.bmp";
const TRACK_SAVER_URL: string = BACKEND_URL + "race/saver/";
const FLOOR_RATIO: number = 0.1;
const Y_OFFSET: number = 0.00001;
const START_Y_OFFSET: number = 0.02;
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

    public static getTrackWalls(track: Track): Array<Object3D> {
        const walls: Array<Object3D> = new Array<Object3D>();
        for (let i: number = 0; i < track.points.length - 1; i++) {
            const p3Index: number = (i + 2) === track.points.length ? 1 : (i + 2);
            const p0Index: number = (i - 1) === -1 ? (track.points.length - 2) : (i - 1);
            const p0: Vector3 = TrackLoaderService.toVector(track.points[p0Index]); // Previous
            const p1: Vector3 = TrackLoaderService.toVector(track.points[i]);
            const p2: Vector3 = TrackLoaderService.toVector(track.points[i + 1]);
            const p3: Vector3 = TrackLoaderService.toVector(track.points[p3Index]); // Next
            walls.push(TrackLoaderService.getSegmentWall(p0, p1, p2, p3, -1));
            walls.push(TrackLoaderService.getSegmentWall(p0, p1, p2, p3, 1));
        }

        return walls;
    }

    public static getSegmentWall(pointP: Vector3, pointA: Vector3, pointB: Vector3, pointN: Vector3, relativeOffset: number): Object3D {
        const vecPA: Vector3 = pointA.clone().sub(pointP);
        const vecAB: Vector3 = pointB.clone().sub(pointA);
        const vecBN: Vector3 = pointN.clone().sub(pointB);

        const prevOffset: number = -(vecPA.angleTo(vecAB) / PI_OVER_2) * DEFAULT_TRACK_WIDTH * HALF * relativeOffset;
        const nextOffset: number = -(vecAB.angleTo(vecBN) / PI_OVER_2) * DEFAULT_TRACK_WIDTH * HALF * relativeOffset;

        const perp: Vector3 = new Vector3(vecAB.z, vecAB.y, -vecAB.x).normalize()
            .multiplyScalar(DEFAULT_TRACK_WIDTH * HALF * relativeOffset);
        const distanceAB: number =  vecAB.length();

        const wall: Object3D = new Object3D();
        wall.add(new Collider(2, distanceAB - (nextOffset) - (prevOffset)),
                 new RigidBody(DEFAULT_MASS, true));

        const positionOfTheRoad: Vector3 = pointA.clone().add(vecAB.clone().multiplyScalar(HALF));

        wall.position.copy(positionOfTheRoad.clone().add(perp));
        wall.lookAt(pointB.clone().add(perp));

        return wall;
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
        const geo: PlaneGeometry = new PlaneGeometry(DEFAULT_TRACK_WIDTH, DEFAULT_TRACK_WIDTH / 4);
        geo.rotateX( - PI_OVER_2);

        const mesh: Mesh = new Mesh(geo, TrackLoaderService.getFinishLineMaterial(DEFAULT_TRACK_WIDTH, DEFAULT_TRACK_WIDTH));

        mesh.position.copy(point);
        mesh.position.setY(START_Y_OFFSET);
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
