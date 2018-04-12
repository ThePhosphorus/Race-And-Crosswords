import { TestBed, inject } from '@angular/core/testing';

import { EndGameService } from './end-game.service';

describe('EndGameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EndGameService]
    });
  });

  it('should be created', inject([EndGameService], (service: EndGameService) => {
    expect(service).toBeTruthy();
  }));
});
