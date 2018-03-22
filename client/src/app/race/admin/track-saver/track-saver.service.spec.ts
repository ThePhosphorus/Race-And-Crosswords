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
