import { TestBed } from '@angular/core/testing';

import { VideoEffectsService } from './video-effects.service';

describe('VideoEffectsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoEffectsService = TestBed.get(VideoEffectsService);
    expect(service).toBeTruthy();
  });
});
