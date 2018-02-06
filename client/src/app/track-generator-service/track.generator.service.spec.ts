import { TestBed, inject } from '@angular/core/testing';

import { Track.GeneratorService } from './track.generator.service';

describe('Track.GeneratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Track.GeneratorService]
    });
  });

  it('should be created', inject([Track.GeneratorService], (service: Track.GeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
