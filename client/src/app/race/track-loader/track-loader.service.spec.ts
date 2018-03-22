import { TestBed, inject } from "@angular/core/testing";
import { TrackLoaderService } from "./track-loader.service";
import { HttpClientModule } from "@angular/common/http/";

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
});
