import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareCoordinatorDialogComponent } from './care-coordinator-dialog.component';

describe('CareCoordinatorDialogComponent', () => {
  let component: CareCoordinatorDialogComponent;
  let fixture: ComponentFixture<CareCoordinatorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareCoordinatorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareCoordinatorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
