import { TestBed, inject } from '@angular/core/testing';

import { InputManagerService } from './input-manager.service';

describe('InputManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputManagerService]
    });
  });

  it('should be created', inject([InputManagerService], (service: InputManagerService) => {
    expect(service).toBeTruthy();
  }));
});
