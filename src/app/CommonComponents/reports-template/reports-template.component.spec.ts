import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ReportsTemplateComponent } from './reports-template.component';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AppModule, CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
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
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { ReportsService } from 'src/app/reports/service/reports.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';


describe('ReportsTemplateComponent', () => {
  let component: ReportsTemplateComponent;
  let fixture: ComponentFixture<ReportsTemplateComponent>;
  let appModule = new AppModule();
  // let reportsServiceSpy: jasmine.SpyObj<ReportsService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let reportsService: ReportsService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsTemplateComponent],
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
        // { provide: ReportsService, useValue: reportsServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ReportsService, useValue: reportsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    reportsService = jasmine.createSpyObj('ReportsService', ['getPatientReports']);
    // reportsServiceSpy = jasmine.createSpyObj('ReportsService', ['getPatientReports']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot'], { snapshot: { params: { id: 'test_patient_id' } } });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get status for count type', () => {
    const e = { type: 'count', remainingValue: 5, criteria: 10 };
    const status = component.getStatus(e);
    expect(status).toBe('5 readings remaining of total 10 readings');
  });

  it('should get status for time type', () => {
    const e = { type: 'time', remainingValue: 7.5, criteria: 15 };
    const status = component.getStatus(e);
    expect(status).toBe('7 Mins remaining of total  15 Mins');
  });
  it('should return "Hello, John!" when the name "John" is provided', () => {
    const result = greet('John');
    expect(result).toEqual('Hello, John!');
  });
  // it('should not download the reports when the patient ID is null', () => {
  //   component.patient_id = null;
  //   spyOn(reportsService, 'getPatientReports').and.returnValue(of({}));
  //   component.downloadReports(component.patient_id);
  //   expect(component.fileName).toBeUndefined();
  // });
  // it('should not download the reports when the reports are not found for a patient', () => {
  //   component.patient_id = 'test-patient-id';
  //   spyOn(reportsService, 'getPatientReports').and.returnValue(of(null));
  //   component.downloadReports(component.patient_id);
  //   expect(component.fileName).toBeUndefined();
  // });
});

function greet(name: string): string {
  return `Hello, ${name}!`;
}
