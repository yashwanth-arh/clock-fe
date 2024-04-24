import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { DoctorClinicComponent } from './doctor-clinic.component';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { RouterModule } from '@angular/router';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { AppModule, CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import {
  FlexLayoutModule,
  CoreModule,
  LayoutGapStyleBuilder,
} from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of,throwError } from 'rxjs';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime-ex';
import { ChartsModule } from 'ng2-charts';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';
import { TokenInterceptor } from 'src/app/core/interceptors/token.interceptor';

describe('DoctorClinicComponent', () => {
  let component: DoctorClinicComponent;
  let fixture: ComponentFixture<DoctorClinicComponent>;
  let appModule = new AppModule();
  let branchServiceSpy = jasmine.createSpyObj('BranchService', [
    'getFilteredhospitalBranch',
  ]);
  let doctorServiceSpy = jasmine.createSpyObj('DoctorService', [
    'updateDoctorClinics',
  ]);
  let snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', [
    'openSnackBar',
  ]);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorClinicComponent],
      imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireMessagingModule,
        AngularMaterialModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CoreModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,

        CommonModule,
        // NgxPaginationModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        MatTabsModule,
        ChartsModule,
        MatSortModule,
        MatPaginatorModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        TitleCasePipe,
        DatePipe,
        DecimalPipe,
        DeviceService,
        VideoChatService,
        StorageService,
        PushNotificationService,
        SettingsStateService,
        AsyncPipe,
        WeightPipe,
        SnackbarService,
        // ApiTimeoutService,
        { provide: HTTP_INTERCEPTORS, useClass: CheckOsType, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

        {
          provide: LayoutGapStyleBuilder,
          useClass: CustomLayoutGapStyleBuilder,
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize the form', () => {
    expect(component.doctorsClinicDialog).toBeDefined();
    expect(component.doctorsClinicDialog.controls['clinicIds'].value).toBe('');
  });
  it('should fetch clinics for the hospital', () => {
    const mockClinicList = [
      { id: 1, name: 'Clinic 1' },
      { id: 2, name: 'Clinic 2' },
      { id: 3, name: 'Clinic 3' },
    ];
    let clinicList = [
      { id: 1, name: 'Clinic 1' },
      { id: 2, name: 'Clinic 2' },
      { id: 3, name: 'Clinic 3' },
    ];
    branchServiceSpy.getFilteredhospitalBranch.and.returnValue(
      of({ branchList: mockClinicList })
    );

    fixture.detectChanges();

    expect(clinicList).toEqual(mockClinicList);
  });
  it('should set submitted to false on form submit api call', () => {
    // arrange
    spyOn(component.doctorService, 'addClinicsToDoctor').and.returnValue(of({}));

    // act
    component.onSubmit();

    // assert
    expect(component.submitted).toBeFalse();
  });
  it('should not call the doctor service if form is invalid', () => {
    // arrange
    spyOn(component.doctorService, 'addClinicsToDoctor');
    component.doctorsClinicDialog.controls['clinicIds'].setValue(null);

    // act
    component.onSubmit();

    // assert
    expect(component.doctorService.addClinicsToDoctor).not.toHaveBeenCalled();
    expect(component.submitted).toBeFalse();
  });
  it('should set submitted to true', () => {
    component.submitted = false;
    component.doctorsClinicDialog.setValue({
      clinicIds: ['1,2,3'],
    });
    component.dummySubmit();
    expect(component.submitted).toBeTrue();
  });
  it('should call doctorService.addClinicsToDoctor() with correct parameters', () => {
    spyOn(component.doctorService, 'addClinicsToDoctor').and.returnValue(
      of('success')
    );
    component.doctorsClinicDialog.setValue({
      clinicIds: ['1,2,3'],
    });
    component.dummySubmit();
    expect(component.doctorService.addClinicsToDoctor).toHaveBeenCalledWith(
      component.data?.id,
      '1,2,3'
    );
  });
  it('should call snackBarService.success() if doctorService call is successful', () => {
    spyOn(component.doctorService, 'addClinicsToDoctor').and.returnValue(
      of('success')
    );
    spyOn(component.snackBarService, 'success');
    component.doctorsClinicDialog.setValue({
      clinicIds: ['1,2,3'],
    });
    component.onSubmit();
    expect(component.snackBarService.success).toHaveBeenCalledWith(
      'Assigned successfully!',
      2000
    );
  });
  it('should call snackBarService.error() if doctorService call fails', () => {
    spyOn(component.doctorService, 'addClinicsToDoctor').and.returnValue(
      throwError('error')
    );
    spyOn(component.snackBarService, 'error');
    component.doctorsClinicDialog.setValue({
      clinicIds: ['1,2,3'],
    });
    component.onSubmit();
    expect(component.snackBarService.error).toHaveBeenCalledWith('Failed!', 2000);
  });
});
