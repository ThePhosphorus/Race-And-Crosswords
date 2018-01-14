import { TestBed, inject } from "@angular/core/testing";

import { AppModule } from "./app.module";

import { BasicService } from "./basic.service";

describe("BasicService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ]
        });
    });

    it("should be created", inject([BasicService], (service: BasicService) => {
        expect(service).toBeTruthy();
    }));
});
