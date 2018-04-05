import { Injectable } from "@angular/core";
import {
    Vector3, Mesh, PlaneGeometry, Texture, RepeatWrapping, DoubleSide, CircleGeometry, MeshPhongMaterial, Object3D
} from "three";
import { Track } from "../../../../../common/race/track";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { BACKEND_URL, HALF, PI_OVER_2, DOUBLE, TRIPLE } from "../../global-constants/constants";
import { DEFAULT_TRACK_WIDTH, DEFAULT_MASS, DEFAULT_WALL_WIDTH } from "../race.constants";
import { Collider } from "../game-component/collision/collider";
import { RigidBody } from "../game-component/rigid-body/rigid-body";
import { Vector3Struct } from "../../../../../common/race/vector3-struct";
import { LoaderService } from "../game-component/loader-service/loader.service";
import { LoadedTexture } from "../game-component/loader-service/load-types.enum";

const TRACK_SAVER_URL: string = BACKEND_URL + "race/saver/";
const TRACK_SAVER_INCPLAY_URL: string = TRACK_SAVER_URL + "play/";
const FLOOR_RATIO: number = 0.1;
const Y_OFFSET: number = 0.00001;
const START_Y_OFFSET: number = 0.02;
const CORNER_NB_SEGMENTS: number = 20;
const FINISH_LINE_OPACITY: number = 0.2;
const FINISH_LINE_LENGTH_RATIO: number = 4;

@Injectable()
export class TrackLoaderService {
    public constructor(private _http: HttpClient, private loader: LoaderService) {}

    public static toVector(vector: Vector3Struct): Vector3 {
        return new Vector3(vector.x, vector.y, vector.z);
    }

    public getTrackMeshs(track: Track): Mesh[] {
        const meshs: Array<Mesh> = new Array<Mesh>();
        const startMesh: Mesh =
            this.getStartMesh(
                TrackLoaderService.toVector(track.points[0]),
                TrackLoaderService.toVector(track.points[1])
            );
        meshs.push(startMesh);
        for (let i: number = 0; i < track.points.length - 1; i++) {
            const roadMesh: Mesh = this.getRoad(
                TrackLoaderService.toVector(track.points[i]),
                TrackLoaderService.toVector(track.points[i + 1]));
            if (i === 0) {
                roadMesh.position.setY(DOUBLE * Y_OFFSET);
            } else if (i % DOUBLE) { roadMesh.position.setY(Y_OFFSET); }
            meshs.push(roadMesh);

            meshs.push(this.getCornerAprox(
                TrackLoaderService.toVector(track.points[i]),
                TrackLoaderService.toVector(track.points[(i === 0) ? track.points.length - 1 : i - 1]),
                TrackLoaderService.toVector(track.points[(i === track.points.length - 1) ? 0 : i + 1])
            ));
        }

        return meshs;
    }

    public  getTrackWalls(track: Track): Array<Object3D> {
        const walls: Array<Object3D> = new Array<Object3D>();
        for (let i: number = 0; i < track.points.length - 1; i++) {
            const p3Index: number = (i + 2) === track.points.length ? 1 : (i + 2);
            const p0Index: number = (i - 1) === -1 ? (track.points.length - 2) : (i - 1);
            const p0: Vector3 = TrackLoaderService.toVector(track.points[p0Index]); // Previous
            const p1: Vector3 = TrackLoaderService.toVector(track.points[i]);
            const p2: Vector3 = TrackLoaderService.toVector(track.points[i + 1]);
            const p3: Vector3 = TrackLoaderService.toVector(track.points[p3Index]); // Next
            walls.push(this.getSegmentWall(p0, p1, p2, p3, -1));
            walls.push(this.getSegmentWall(p0, p1, p2, p3, 1));
        }

        return walls;
    }

    private  getSegmentWall(pointP: Vector3, pointA: Vector3, pointB: Vector3, pointN: Vector3, relativeOffset: number): Object3D {
        const vecPA: Vector3 = pointA.clone().sub(pointP);
        const vecAB: Vector3 = pointB.clone().sub(pointA);
        const vecBN: Vector3 = pointN.clone().sub(pointB);

        const perpAB: Vector3 = new Vector3(vecAB.z, vecAB.y, -vecAB.x).normalize()
            .multiplyScalar(((DEFAULT_TRACK_WIDTH * HALF) + (DEFAULT_WALL_WIDTH * HALF)) * relativeOffset);
        const perpPA: Vector3 = new Vector3(vecPA.z, vecPA.y, -vecPA.x).normalize()
            .multiplyScalar(((DEFAULT_TRACK_WIDTH * HALF) + (DEFAULT_WALL_WIDTH * HALF)) * relativeOffset);
        const perpBN: Vector3 = new Vector3(vecBN.z, vecBN.y, -vecBN.x).normalize()
            .multiplyScalar(((DEFAULT_TRACK_WIDTH * HALF) + (DEFAULT_WALL_WIDTH * HALF)) * relativeOffset);

        const p1: Vector3 = this.findIntersection(pointP.clone().add(perpPA), pointA.clone().add(perpPA),
                                                  pointA.clone().add(perpAB), pointB.clone().add(perpAB));

        const p2: Vector3 = this.findIntersection(pointA.clone().add(perpAB), pointB.clone().add(perpAB),
                                                  pointB.clone().add(perpBN), pointN.clone().add(perpBN));
        const vecP1P2: Vector3 = p2.clone().sub(p1);
        const wall: Object3D = new Object3D();
        wall.add(new Collider(DEFAULT_WALL_WIDTH, vecP1P2.length()),
                 new RigidBody(DEFAULT_MASS, true));

        wall.position.copy(p1.clone().add(vecP1P2.clone().multiplyScalar(HALF)));
        wall.lookAt(p2);

        return wall;
    }

    private  findIntersection(p1: Vector3, p2: Vector3, p3: Vector3, p4: Vector3): Vector3 {
        if (p2.equals(p3)) {
            return p2.clone();
        }
        const x1: number = p1.x;
        const y1: number = p1.z;
        const x2: number = p2.x;
        const y2: number = p2.z;
        const x3: number = p3.x;
        const y3: number = p3.z;
        const x4: number = p4.x;
        const y4: number = p4.z;
        const intersectionX: number = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
                                      ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        const intersectionY: number = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
                                      ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

        return new Vector3(intersectionX, p1.y, intersectionY);
    }

    private  getTrackMaterial(width: number, length: number): MeshPhongMaterial {
        const texture: Texture = this.loader.getTexture(LoadedTexture.track);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(width * FLOOR_RATIO, length * FLOOR_RATIO);

        return new MeshPhongMaterial({ map: texture, side: DoubleSide });
    }

    private getFinishLineMaterial(width: number, length: number): MeshPhongMaterial {
        const texture: Texture = this.loader.getTexture(LoadedTexture.start);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(width, length / FINISH_LINE_LENGTH_RATIO);
        const mat: MeshPhongMaterial = new MeshPhongMaterial({ map: texture, side: DoubleSide });
        mat.transparent = true;
        mat.opacity = FINISH_LINE_OPACITY;

        return mat;
    }

    private getCornerAprox(center: Vector3, before: Vector3, after: Vector3): Mesh {
        const circleGeo: CircleGeometry = new CircleGeometry(HALF * DEFAULT_TRACK_WIDTH, CORNER_NB_SEGMENTS);
        circleGeo.rotateX(- PI_OVER_2);
        const circleMesh: Mesh = new Mesh(circleGeo, this.getTrackMaterial(DEFAULT_TRACK_WIDTH, DEFAULT_TRACK_WIDTH));
        circleMesh.position.copy(new Vector3(center.x, center.y + TRIPLE * Y_OFFSET, center.z));
        circleMesh.receiveShadow = true;

        return circleMesh;
    }

    private getStartMesh(point: Vector3, pointB: Vector3, width?: number): Mesh {
        const geo: PlaneGeometry = new PlaneGeometry(DEFAULT_TRACK_WIDTH, DEFAULT_TRACK_WIDTH / FINISH_LINE_LENGTH_RATIO);
        geo.rotateX(- PI_OVER_2);

        const mesh: Mesh = new Mesh(geo, this.getFinishLineMaterial(DEFAULT_TRACK_WIDTH, DEFAULT_TRACK_WIDTH));

        mesh.position.copy(point);
        mesh.position.setY(START_Y_OFFSET);
        mesh.lookAt(pointB);

        mesh.receiveShadow = true;

        return mesh;
    }

    private getRoad(pointA: Vector3, pointB: Vector3, width?: number): Mesh {
        const trackWidth: number = width ? width : DEFAULT_TRACK_WIDTH;
        const vecAB: Vector3 = pointB.clone().sub(pointA);
        const distanceAB: number = vecAB.length();
        const geo: PlaneGeometry = new PlaneGeometry(trackWidth, distanceAB);
        geo.rotateX(- PI_OVER_2);

        const mesh: Mesh = new Mesh(geo, this.getTrackMaterial(trackWidth, distanceAB));
        const positionOfTheRoad: Vector3 = pointA.clone().add(vecAB.clone().multiplyScalar(HALF));

        mesh.position.copy(positionOfTheRoad);
        mesh.position.setY(0);
        mesh.lookAt(pointB);

        mesh.receiveShadow = true;

        return mesh;
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
}
