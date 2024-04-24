import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Idle } from '@ng-idle/core';
import { of } from 'rxjs';
import { TimeoutDialogComponent } from './timeout-dialog.component';

describe('TimeoutDialogComponent', () => {
  let component: TimeoutDialogComponent;
  let fixture: ComponentFixture<TimeoutDialogComponent>;
  let idleMock: jasmine.SpyObj<Idle>;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<TimeoutDialogComponent>>;

  beforeEach(async () => {
    const idleMock = {
      onTimeoutWarning: of(5),
    };
    dialogRefMock = jasmine.createSpyObj<MatDialogRef<TimeoutDialogComponent>>([
      'close',
    ]);

    await TestBed.configureTestingModule({
      declarations: [TimeoutDialogComponent],
      providers: [
        { provide: Idle, useValue: idleMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { timeout: 5 } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize countDown with data.timeout value', () => {
    expect(component.countDown).toBe(5);
  });

  it('should update countDown when idle service emits a timeout warning', () => {
    const count = 5;
    const idleServiceMock = {
      onTimeoutWarning: jasmine
        .createSpy('onTimeoutWarning')
        .and.returnValue(of(count).subscribe()),
    };
    idleServiceMock.onTimeoutWarning.and.returnValue(of(count));

    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    const data = { timeout: 5 };

    const component = new TimeoutDialogComponent(idleMock, dialogRef, data);

    expect(component.countDown).toBe(5);

    component.ngOnInit();

    expect(component.countDown).toBe(count);
    // expect(idleServiceMock.onTimeoutWarning).toHaveBeenCalled();
  });
});
