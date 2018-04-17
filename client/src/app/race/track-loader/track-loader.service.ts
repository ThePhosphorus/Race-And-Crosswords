import { Injectable } from "@angular/core";
import {
    Vector3, Mesh, PlaneGeometry, Texture, RepeatWrapping, DoubleSide, CircleGeometry, MeshPhongMaterial, Object3D
} from "three";
import { Track } from "../../../../../common/race/track";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { BACKEND_URL, HALF, PI_OVER_2, TRIPLE } from "../../global-constants/constants";
import { DEFAULT_TRACK_WIDTH, DEFAULT_MASS, DEFAULT_WALL_WIDTH } from "../race.constants";
import { Collider } from "../game-component/collision/collider";
import { RigidBody } from "../game-component/rigid-body/rigid-body";
import { Vector3Struct } from "../../../../../common/race/vector3-struct";
import { LoaderService } from "../game-component/loader-service/loader.service";
import { LoadedTexture } from "../game-component/loader-service/load-types.enum";
import { Highscore } from "../../../../../common/race/highscore";
import { TrackMeshGenerator } from "./track-mesh-generator";

const TRACK_SAVER_URL: string = BACKEND_URL + "race/saver/";
const TRACK_SAVER_INCPLAY_URL: string = TRACK_SAVER_URL + "play/";
const TRACK_SAVER_UPDATE_HIGHSCORE: string = TRACK_SAVER_URL + "highscore/";
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

    public static toVectors(vectors: Array<Vector3Struct>): Array<Vector3> {
        const vectorArr: Array<Vector3> = new Array<Vector3>();
        vectors.forEach((vec) => vectorArr.push(TrackLoaderService.toVector(vec)));

        return vectorArr;
    }

    public getTrackMeshs(track: Track): Mesh[] {
        const vectorTrack: Array<Vector3> = TrackLoaderService.toVectors(track.points);
        const meshs: Array<Mesh> = new Array<Mesh>();

        const generator: TrackMeshGenerator = new TrackMeshGenerator(track);

        meshs.push(generator.newMesh);
        const startMesh: Mesh = this.getStartMesh(vectorTrack[0], vectorTrack[1]);
        meshs.push(startMesh);

        return meshs;
    }

    public  getTrackWalls(track: Track): Array<Object3D> {
        const generator: TrackMeshGenerator = new TrackMeshGenerator(track);

        return generator.generateWalls();
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
