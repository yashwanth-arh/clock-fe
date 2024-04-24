import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalAddEditComponent } from './hospital-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { AppModule, CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import {
  CommonModule,
  TitleCasePipe,
  DatePipe,
  DecimalPipe,
  AsyncPipe,
} from '@angular/common';
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
import { RouterModule } from '@angular/router';
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
import { HospitalManagementService } from '../../service/hospital-management.service';
import { of } from 'rxjs';

describe('HospitalAddEditComponent', () => {
  let component: HospitalAddEditComponent;
  let fixture: ComponentFixture<HospitalAddEditComponent>;
  let appModule = new AppModule();
  let hospitalServiceSpy = jasmine.createSpyObj('HospitalManagementService', [
    'createhospital',
    'edithospital',
  ]);
  let matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
  let matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', [
    'success',
    'error',
  ]);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HospitalAddEditComponent],
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
        {
          provide: LayoutGapStyleBuilder,
          useClass: CustomLayoutGapStyleBuilder,
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        {
          provide: HospitalManagementService,
          useValue: hospitalServiceSpy,
        },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize the form', () => {
    expect(component.addEdithospital).toBeTruthy();
  });
  it('should remove status field if the mode is "ADD"', () => {
    component.data = { mode: 'ADD' };
    component.ngOnInit();
    expect(component.addEdithospital.get('status')).toBeNull();
  });
  it('should keep status field if the mode is not "ADD"', () => {
    component.data = { mode: 'EDIT' };
    component.ngOnInit();
    expect(component.addEdithospital.get('status')).not.toBeNull();
  });
  it('should initialize emailidValidation to true when data mode is ADD', () => {
    component.data = { mode: 'ADD' };
    component.ngOnInit();
    expect(component.emailidValidation).toBeTrue();
  });
  it('should set submitted to true when form is submitted', () => {
    component.onSubmit();
    expect(component.submitted).toBeTrue();
  });

  it('should call hospitalService to create new hospital', () => {
    component.data = { mode: 'ADD' };
    const mockhospital = {
      name: 'Test Org',
      emailId: 'test@test.com',
      contactNumber: '9786868768',
      addressLine: 'Address',
      zipCode: '90001',
      practiceNPI: '1232445454',
      city: 'Los Angeles',
      state: 'California',
      status: 'Active',
      address: {
        state: 'California',
        city: 'Los Angeles',
        addressLine: 'Address',
        zipCode: '90001',
      },
    };
    component.addEdithospital.setValue(mockhospital);
    hospitalServiceSpy.createhospital.and.returnValue(of({}));
    component.onSubmit();
    expect(component.hospitalService.createhospital).toHaveBeenCalledWith(
      mockhospital
    );
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
  it('should submit the form in "EDIT" mode and close the dialog on success', () => {
    // Arrange
    const mockhospital = {
      name: 'Test Org',
      emailId: 'test@test.com',
      contactNumber: '9786868768',
      addressLine: 'Address',
      zipCode: '90001',
      practiceNPI: '1232445454',
      city: 'Los Angeles',
      state: 'California',
      status: 'Active',
      address: {
        state: 'California',
        city: 'Los Angeles',
        addressLine: 'Address',
        zipCode: '90001',
      },
    };
    // const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    // const hospitalServiceSpy = jasmine.createSpyObj('hospitalService', ['edithospital']);
    hospitalServiceSpy.edithospital.and.returnValue(of({}));

    // const component = new AddEdithospitalComponent(dialogRefSpy, hospitalServiceSpy, ...);
    component.data = { mode: 'EDIT', edit: { id: 'org-id' } };

    // Act
    component.addEdithospital.setValue(mockhospital);
    component.onSubmit();

    // Assert
    expect(hospitalServiceSpy.edithospital).toHaveBeenCalledWith(
      'org-id',
      mockhospital
    );
    expect(matDialogRefSpy.close).toHaveBeenCalled();
  });
});
