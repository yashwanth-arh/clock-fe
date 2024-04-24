import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockHealthAdminComponent } from './clock-health-admin.component';

describe('ClockHealthAdminComponent', () => {
  let component: ClockHealthAdminComponent;
  let fixture: ComponentFixture<ClockHealthAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClockHealthAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockHealthAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
