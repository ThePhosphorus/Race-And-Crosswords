import { TestBed, inject } from '@angular/core/testing';

import { LightManagerService } from './light-manager.service';

describe('LightManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LightManagerService]
    });
  });

  it('should be created', inject([LightManagerService], (service: LightManagerService) => {
    expect(service).toBeTruthy();
  }));
});
