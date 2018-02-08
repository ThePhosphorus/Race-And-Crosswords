import { TestBed, inject, ComponentFixture } from "@angular/core/testing";

import { ConstraintValidatorService } from "./constraint-validator.service";

describe("ConstraintValidatorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConstraintValidatorService]
    });
  });

  it("should be created", inject([ConstraintValidatorService], (service: ConstraintValidatorService) => {
    expect(service).toBeTruthy();
  }));
});
