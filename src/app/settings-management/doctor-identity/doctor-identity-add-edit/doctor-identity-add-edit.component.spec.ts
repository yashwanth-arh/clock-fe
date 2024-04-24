import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorIdentityAddEditComponent } from './doctor-identity-add-edit.component';

describe('DoctorIdentityAddEditComponent', () => {
  let component: DoctorIdentityAddEditComponent;
  let fixture: ComponentFixture<DoctorIdentityAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorIdentityAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorIdentityAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
