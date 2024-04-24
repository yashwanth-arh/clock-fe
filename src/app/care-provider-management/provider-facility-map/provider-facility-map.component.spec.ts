import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderFacilityMapComponent } from './provider-facility-map.component';

describe('ProviderFacilityMapComponent', () => {
  let component: ProviderFacilityMapComponent;
  let fixture: ComponentFixture<ProviderFacilityMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderFacilityMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderFacilityMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
