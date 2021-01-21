/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OpdService } from './opd.service';

describe('Service: Opd', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpdService]
    });
  });

  it('should ...', inject([OpdService], (service: OpdService) => {
    expect(service).toBeTruthy();
  }));
});
