import { TestBed, inject } from '@angular/core/testing';

import { EndGameServiceService } from './end-game-service.service';

describe('EndGameServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EndGameServiceService]
    });
  });

  it('should be created', inject([EndGameServiceService], (service: EndGameServiceService) => {
    expect(service).toBeTruthy();
  }));
});
