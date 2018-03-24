import { TestBed, inject } from "@angular/core/testing";
import { TrackLoaderService } from "./track-loader.service";
import { HttpClientModule } from "@angular/common/http/";
import { Track, Vector3Struct } from "../../../../../common/communication/track";
import { Mesh } from "three";

/* tslint:disable:no-magic-numbers */
describe("Track Loader", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [TrackLoaderService],
        imports: [HttpClientModule]
        });
    });

    it("should be created", inject([TrackLoaderService], (service: TrackLoaderService) => {
        expect(service).toBeTruthy();
    }));

    it("should be return mesh", inject([TrackLoaderService], (service: TrackLoaderService) => {
        const points: Array<Vector3Struct> = new Array<Vector3Struct>();
        points.push(new Vector3Struct(0, 0, 0));
        points.push(new Vector3Struct(1, 0, 0));
        points.push(new Vector3Struct(1, 0, 1));
        points.push(new Vector3Struct(0, 0, 1));
        const meshs: Array<Mesh> = TrackLoaderService.getTrackMeshs(new Track("", "", "", points));
        expect(meshs.length).toBeGreaterThan(points.length);
    }));
});
