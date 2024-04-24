import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ZipStateCityService } from './zip-state-city.service';
import { CheckOsType } from '../interceptors/check-os-type';
import {DecimalPipe} from '@angular/common';

describe('ZipStateCityService', () => {
  let service: ZipStateCityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule,RouterModule.forRoot([])],
      providers: [
        DecimalPipe,
        { provide: HTTP_INTERCEPTORS, useClass: CheckOsType, multi: true },
      ]
    });
    service = TestBed.inject(ZipStateCityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
