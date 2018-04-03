import { TestBed, inject } from "@angular/core/testing";

import { LoaderServiceService } from "./loader-service.service";

describe("LoaderServiceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderServiceService]
    });
  });

  it("should be created", inject([LoaderServiceService], (service: LoaderServiceService) => {
    expect(service).toBeTruthy();
  }));
});
