import { TestBed } from '@angular/core/testing';

import { RestAPILayerService } from './rest-apilayer.service';

describe('RestAPILayerService', () => {
  let service: RestAPILayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestAPILayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
