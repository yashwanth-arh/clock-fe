import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';

import { CaregiverDialogComponent } from './caregiver-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppModule, CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { FlexLayoutModule, CoreModule, LayoutGapStyleBuilder } from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
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
import { CaregiverService } from '../caregiver.service';


describe('CaregiverDialogComponent', () => {
  let component: CaregiverDialogComponent;
  let fixture: ComponentFixture<CaregiverDialogComponent>;
  let appModule = new AppModule();
  let caregiverService: CaregiverService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: appModule.declarations,
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
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaregiverDialogComponent);
    component = fixture.componentInstance;
    caregiverService = TestBed.inject(CaregiverService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set submitted to true', () => {
    component.onSubmit();
    expect(component.submitted).toBeTrue();
  });
  it('should return if form is invalid', () => {
    component.caregiverForm.setValue({
      name: '',
      email: '',
      hospital: null,
      branch: null,
      address: '',
      city: '',
      state: '',
      zipCode: '',
      contactNo:''
    });
    const addCaregiverSpy = spyOn(caregiverService, 'addCaregiver');
    component.onSubmit();
    expect(addCaregiverSpy).not.toHaveBeenCalled();
    expect(component.submitted).toBeTrue();
  });
  it('should return when form is invalid', () => {
    const invalidForm = {
      invalid: true
    };
    component.caregiverForm = invalidForm as any;
    spyOn(component.caregiverService, 'addCaregiver');
    // spyOn(component.dialogRef, 'close');
    component.onSubmit();
    expect(component.caregiverService.addCaregiver).not.toHaveBeenCalled();
    // expect(component.dialogRef.close).not.toHaveBeenCalled();
    expect(component.submitted).toBeTruthy();
  });
  it('should show error message when zip code is not entered or is less than 6 digits', () => {
    component.caregiverForm.get('zipCode').setValue('');
    spyOn(component.snackBarService, 'error');
    component.onZipCodeSelection(null);
    expect(component.snackBarService.error).toHaveBeenCalledWith('Enter 6 digit zipcode');
  });
  it('should show error message when zip code is not entered or is less than 6 digits', () => {
    component.caregiverForm.get('zipCode').setValue('');
    spyOn(component.snackBarService, 'error');
    component.onZipCodeSelection(null);
    expect(component.snackBarService.error).toHaveBeenCalledWith('Enter 6 digit zipcode');
  });

});
