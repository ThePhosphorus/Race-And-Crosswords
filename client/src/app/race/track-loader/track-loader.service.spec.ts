import { TestBed, inject } from "@angular/core/testing";
import { TrackLoaderService } from "./track-loader.service";
import { HttpClientModule } from "@angular/common/http/";
import { Track, Vector3Struct } from "../../../../../common/communication/track";
import { Mesh, Object3D } from "three";
import { DEFAULT_TRACK_WIDTH, DEFAULT_WALL_WIDTH } from "../race.constants";

/* tslint:disable:no-magic-numbers */
describe("Track Loader", () => {

    const track: Array<Vector3Struct> = new Array<Vector3Struct>();

    beforeAll(() => {
        track.push(new Vector3Struct(0, 0, 0));
        track.push(new Vector3Struct(1, 0, 0));
        track.push(new Vector3Struct(1, 0, 1));
        track.push(new Vector3Struct(0, 0, 1));
        track.push(new Vector3Struct(0, 0, 0));
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [TrackLoaderService],
        imports: [HttpClientModule]
        });
    });

    it("should be created", inject([TrackLoaderService], (service: TrackLoaderService) => {
        expect(service).toBeTruthy();
    }));

    it("should create meshs", inject([TrackLoaderService], (service: TrackLoaderService) => {
        const meshs: Array<Mesh> = TrackLoaderService.getTrackMeshs(new Track("", "", "", track));
        expect(meshs.length).toBeGreaterThan(track.length);
    }));

    it("should create walls", inject([TrackLoaderService], (service: TrackLoaderService) => {
        const walls: Array<Object3D> = TrackLoaderService.getTrackWalls(new Track("", "", "", track));
        expect(walls.length).toBe((track.length - 1) * 2);
    }));

    it("should have parallel walls", inject([TrackLoaderService], (service: TrackLoaderService) => {
        const walls: Array<Object3D> = TrackLoaderService.getTrackWalls(new Track("", "", "", track));
        expect(walls[0].getWorldDirection().angleTo(walls[1].getWorldDirection()) % Math.PI).toBeCloseTo(0);
    }));

    it("should create walls with offset of track width", inject([TrackLoaderService], (service: TrackLoaderService) => {
        const walls: Array<Object3D> = TrackLoaderService.getTrackWalls(new Track("", "", "", track));
        expect(walls[1].position.clone().sub(walls[0].position).length()).toBe(DEFAULT_TRACK_WIDTH + DEFAULT_WALL_WIDTH);
    }));
});
