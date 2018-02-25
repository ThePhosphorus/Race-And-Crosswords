import { TestBed, inject } from '@angular/core/testing';

import { CrosswordGameService } from './crossword-game.service';

describe('CrosswordGameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrosswordGameService]
    });
  });

  it('should be created', inject([CrosswordGameService], (service: CrosswordGameService) => {
    expect(service).toBeTruthy();
  }));
});
