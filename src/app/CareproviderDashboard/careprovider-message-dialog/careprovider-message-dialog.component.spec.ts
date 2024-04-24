import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { CommonModule, TitleCasePipe, DatePipe, DecimalPipe, AsyncPipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { FlexLayoutModule, CoreModule, LayoutGapStyleBuilder } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
import { ChartsModule } from 'ng2-charts';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule, CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';

import { CareproviderMessageDialogComponent } from './careprovider-message-dialog.component';

describe('CareproviderMessageDialogComponent', () => {
  let component: CareproviderMessageDialogComponent;
  let fixture: ComponentFixture<CareproviderMessageDialogComponent>;
  let appModule = new AppModule();
  const expectedCellNo = '+911234567890';
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
    fixture = TestBed.createComponent(CareproviderMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return the correct error message for the message field', () => {
    const messageControl = component.messageDialog.controls.message;

    messageControl.setValue('');
    expect(component.getErrorName()).toEqual('Message is required');

    messageControl.setValue('123');
    expect(component.getErrorName()).toEqual('');

    messageControl.setValue('Hello, world!');
    expect(component.getErrorName()).toEqual('');
  });
  it('should create a FormGroup', () => {
    expect(component.messageDialog).toBeDefined();
    expect(component.messageDialog.get('message')).toBeDefined();
    expect(component.messageDialog.get('to')).toBeDefined();
  });
  it('should be invalid when message is not provided', () => {
    component.messageDialog.setValue({ message: '', to: '+919876543210' });
    expect(component.messageDialog.valid).toBeFalsy();
  });
  it('should be invalid when recipient is not provided', () => {
    component.messageDialog.setValue({ message: 'Test message', to: '' });
    expect(component.messageDialog.valid).toBeFalsy();
  });
  it('should be valid when both message and recipient are provided', () => {
    component.messageDialog.setValue({ message: 'Test message', to: '+919876543210' });
    expect(component.messageDialog.valid).toBeTruthy();
  });
  // it('should call onSubmit() when form is submitted', () => {
  //   spyOn(component, 'onSubmit');
  //   const button = fixture.debugElement.nativeElement.querySelector('button');
  //   button.click();
  //   expect(component.onSubmit).toHaveBeenCalled();
  // });
  // it('should clear the form when cancelMessage() is called', () => {
  //   component.messageDialog.setValue({ message: 'Test message', to: '+919876543210' });
  //   component.cancelMessage();
  //   expect(component.messageDialog.get('message').value).toEqual('');
  //   expect(component.messageDialog.get('to').value).toEqual('+919876543210');
  // });
  // it('should initialize the form with the correct values', () => {
  //   const expectedCellNo = {};
  //   const expectedPatientId = 'some_patient_id';

  //   spyOn(localStorage, 'getItem').and.returnValue(expectedPatientId);

  //   component.data = expectedCellNo;
  //   component.ngOnInit();

  //   expect(component.cellNo).toEqual(expectedCellNo);
  //   expect(component.patientId).toEqual(expectedPatientId);
  //   expect(component.messageDialog.value).toEqual({ message: '', to: expectedCellNo });
  // });
});
