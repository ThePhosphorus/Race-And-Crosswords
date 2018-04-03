import { TestBed, inject } from "@angular/core/testing";

import { LoaderService } from "./loader.service";

describe("LoaderServiceService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoaderService]
        });
    });

    it(
        "should be created",
        inject([LoaderService], (service: LoaderService) => {
            expect(service).toBeTruthy();
        })
    );

    it(
        "shouldn't have loaded anything at start",
        inject([LoaderService], (service: LoaderService) => {})
    );
});
