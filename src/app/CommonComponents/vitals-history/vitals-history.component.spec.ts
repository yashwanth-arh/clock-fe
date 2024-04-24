import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { VitalsHistoryComponent } from './vitals-history.component';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { of } from 'rxjs';

describe('VitalsHistoryComponent', () => {
  let component: VitalsHistoryComponent;
  let fixture: ComponentFixture<VitalsHistoryComponent>;
  let appModule = new AppModule();
  let serviceSpy: jasmine.SpyObj<CaregiverDashboardService>;
  let settingsStateSpy: jasmine.SpyObj<SettingsStateService>;
  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('CaregiverDashboardService', ['getVitalHistory']);
    settingsStateSpy = jasmine.createSpyObj('SettingsStateService', ['setWeightUnit']);

    await TestBed.configureTestingModule({
      declarations: [VitalsHistoryComponent],
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
        { provide: CaregiverDashboardService, useValue: serviceSpy },
        { provide: SettingsStateService, useValue: settingsStateSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.setItem('wt', 'kg');
      serviceSpy.getVitalHistory.and.returnValue(of({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have matTabValues array with 5 elements', () => {
    expect(component.matTabValues.length).toEqual(5);
  });

  it('should have weightColumns, bsColumns, and bpColumns arrays with 3, 2, and 2 elements respectively', () => {
    expect(component.weightColumns.length).toEqual(3);
    expect(component.bsColumns.length).toEqual(2);
    expect(component.bpColumns.length).toEqual(2);
  });
  it('should call the getReadings method', () => {
    expect(serviceSpy.getVitalHistory).toHaveBeenCalled();
  });
  it('should set the weight unit based on the "wt" local storage', () => {
    expect(settingsStateSpy.setWeightUnit).toHaveBeenCalledWith('kg');
  });
  it('should set the patient ID correctly', () => {
    const expectedPatientId = '123';
    localStorage.setItem('patientId', expectedPatientId);
    component.ngOnInit();  
    expect(component.patientId).toEqual(expectedPatientId);
  });
  it('should set the weight unit correctly', () => {
    localStorage.setItem('wt', 'lbs');
    component.ngOnInit();
    expect(settingsStateSpy.setWeightUnit).toHaveBeenCalledWith('kg');
  });
});
