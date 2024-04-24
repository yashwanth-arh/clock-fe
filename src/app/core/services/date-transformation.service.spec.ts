import { DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { DateTransformationService } from './date-transformation.service';

describe('DateTransformationService', () => {
  let service: DateTransformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatePipe
       ],
    });
    service = TestBed.inject(DateTransformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
