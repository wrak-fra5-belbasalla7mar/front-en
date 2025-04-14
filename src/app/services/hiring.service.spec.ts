import { TestBed } from '@angular/core/testing';

import { HiringService } from './hiring.service';

describe('HiringService', () => {
  let service: HiringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
