import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockHealthAdminDialogComponent } from './clock-health-admin-dialog.component';

describe('ClockHealthAdminDialogComponent', () => {
  let component: ClockHealthAdminDialogComponent;
  let fixture: ComponentFixture<ClockHealthAdminDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClockHealthAdminDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockHealthAdminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
