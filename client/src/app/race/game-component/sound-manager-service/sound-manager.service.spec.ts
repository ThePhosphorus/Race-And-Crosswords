import { TestBed, inject } from "@angular/core/testing";

import { SoundManagerService } from "./sound-manager.service";
import { LoaderService } from "../loader-service/loader.service";

describe("SoundManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SoundManagerService, LoaderService]
        });
    });

    it("should be created", inject([SoundManagerService], (service: SoundManagerService) => {
        expect(service).toBeTruthy();
    }));
});
