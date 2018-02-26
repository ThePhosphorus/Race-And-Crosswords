import { TestBed, inject } from "@angular/core/testing";

import { GridCommunicationService } from "./grid-communication.service";

describe("GridCommunicationService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridCommunicationService]
    });
  });

  it("should be created", inject([GridCommunicationService], (service: GridCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
