import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastActivitiesDialogComponent } from './past-activities-dialog.component';

describe('PastActivitiesDialogComponent', () => {
  let component: PastActivitiesDialogComponent;
  let fixture: ComponentFixture<PastActivitiesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastActivitiesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PastActivitiesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
