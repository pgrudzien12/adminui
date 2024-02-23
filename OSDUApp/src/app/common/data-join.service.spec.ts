import { TestBed } from '@angular/core/testing';

import { DataJoinService } from './data-join.service';

describe('DataJoinService', () => {
  let service: DataJoinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataJoinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
