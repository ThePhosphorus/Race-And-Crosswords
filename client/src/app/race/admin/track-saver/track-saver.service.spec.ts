import { TestBed, inject } from "@angular/core/testing";
import { TrackSaverService } from "./track-saver.service";
import { Track, Vector3Struct } from "../../../../../../common/communication/track";
import { Vector3 } from "three";
import { HttpClientModule } from "@angular/common/http/";

/* tslint:disable:no-magic-numbers */
describe("Track Saver", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [TrackSaverService],
        imports: [HttpClientModule]
        });
    });

    it("should be created", inject([TrackSaverService], (service: TrackSaverService) => {
        expect(service).toBeTruthy();
    }));

    it("should convert to vector Struct", inject([TrackSaverService], (service: TrackSaverService) => {
        const vector: Vector3 = new Vector3(20, 32, 23);
        const vectorStruct: Vector3Struct = service.toVectorStruct(vector);
        expect(vectorStruct.x).toBe(vector.x);
        expect(vectorStruct.y).toBe(vector.y);
        expect(vectorStruct.z).toBe(vector.z);
    }));

    it("should save the track", inject([TrackSaverService], (service: TrackSaverService) => {
        const name: string = "Name";
        const description: string = "Description";
        const points: Array<Vector3> = new Array<Vector3>();

        const track: Track = service.getTrack(undefined, name, description, points);
        expect(track.name).toBe(name);
        expect(track.description).toBe(description);
        for (let i: number = 0; i < points.length; i++) {
            expect(track.points[i]).toBe(points[i]);
        }
    }));

});
