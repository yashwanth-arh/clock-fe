import { TestBed } from '@angular/core/testing';

import { FilterSharedService } from './filter-shared.service';

describe('FilterSharedService', () => {
  let service: FilterSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
