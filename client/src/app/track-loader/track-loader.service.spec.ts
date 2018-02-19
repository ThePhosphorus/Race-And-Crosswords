import { TestBed, inject } from "@angular/core/testing";
import { TrackLoaderService } from "./track-loader.service";
import { Vector3Struct } from "../../../../common/communication/track";
import { Vector3 } from "three";
import { HttpClientModule } from "@angular/common/http/";

/* tslint:disable:no-magic-numbers */
describe("Track Saver", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [TrackLoaderService],
        imports: [HttpClientModule]
        });
    });

    it("should be created", inject([TrackLoaderService], (service: TrackLoaderService) => {
        expect(service).toBeTruthy();
    }));

    it("should convert to vector Struct", inject([TrackLoaderService], (service: TrackLoaderService) => {
        const vector: Vector3Struct = new Vector3Struct(20, 32, 23);
        const vectorStruct: Vector3 = service.toVector(vector);
        expect(vectorStruct.x).toBe(vector.x);
        expect(vectorStruct.y).toBe(vector.y);
        expect(vectorStruct.z).toBe(vector.z);
    }));
});
