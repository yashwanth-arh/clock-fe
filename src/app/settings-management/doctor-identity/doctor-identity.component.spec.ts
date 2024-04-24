import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorIdentityComponent } from './doctor-identity.component';

describe('DoctorIdentityComponent', () => {
  let component: DoctorIdentityComponent;
  let fixture: ComponentFixture<DoctorIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorIdentityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
