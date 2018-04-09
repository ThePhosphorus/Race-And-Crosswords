import { TestBed, inject } from "@angular/core/testing";

import { LightManagerService } from "./light-manager.service";
import { LoaderService } from "../loader-service/loader.service";

describe("LightManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LightManagerService, LoaderService]
    });
  });

  it("should be created", inject([LightManagerService], (service: LightManagerService) => {
    expect(service).toBeTruthy();
  }));
});
