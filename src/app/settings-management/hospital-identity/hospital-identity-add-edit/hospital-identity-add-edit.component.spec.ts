import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalIdentityAddEditComponent } from './hospital-identity-add-edit.component';

describe('HospitalIdentityAddEditComponent', () => {
  let component: HospitalIdentityAddEditComponent;
  let fixture: ComponentFixture<HospitalIdentityAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalIdentityAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalIdentityAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
