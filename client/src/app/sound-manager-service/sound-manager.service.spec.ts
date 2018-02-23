import { TestBed, inject } from "@angular/core/testing";

import { SoundManagerService } from "./sound-manager.service";

describe("SoundManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SoundManagerService]
        });
    });

    it("should be created", inject([SoundManagerService], (service: SoundManagerService) => {
        expect(service).toBeTruthy();
    }));
});
