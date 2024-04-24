import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalIdentityComponent } from './hospital-identity.component';

describe('HospitalIdentityComponent', () => {
  let component: HospitalIdentityComponent;
  let fixture: ComponentFixture<HospitalIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalIdentityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
