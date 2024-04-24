import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { AppModule, CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';
import { BpReportsComponent } from './bp-reports.component';

describe('BpReportsComponent', () => {
  let component: BpReportsComponent;
  let fixture: ComponentFixture<BpReportsComponent>;
  let appModule = new AppModule();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BpReportsComponent],
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
    fixture = TestBed.createComponent(BpReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should process bp data correctly', () => {
    const bpReport = {
      bpPieCharReport: {
        alertHyperCount: 2,
        alertHypoCount: 1,
        goodNormalCount: 3,
        highAlertHyperCount: 0,
        highAlertHypoCount: 1
      },
      vitalData: {
        bloodPressure: [
          { BP: '120/80', zone: '3', 'Recorded On': '2022-01-01' },
          { BP: '140/90', zone: '1', 'Recorded On': '2022-01-02' },
          { BP: '110/70', zone: '3', 'Recorded On': '2022-01-03' },
          { BP: '130/85', zone: '2', 'Recorded On': '2022-01-04' }
        ]
      }
    };
    component.bpReport = bpReport;
    component.dataProcessing();

    expect(component.bpTrendDataArr).toEqual([
      { name: 'Alert (Hypertension)', value: 2 },
      { name: 'Alert (Hypotension)', value: 1 },
      { name: 'Good (Normal)', value: 3 },
      { name: 'High Alert (Hypertension)', value: 0 },
      { name: 'High Alert (Hypotension)', value: 1 }
    ]);

    expect(component.BPsysrange.length).toEqual(0);
    expect(component.BPdiasrange.length).toEqual(0);
    expect(component.BPsysresult.length).toEqual(0);
    expect(component.BPdiasresult.length).toEqual(0);
  });
  it('should have empty bpTrendDataArr array', () => {
    expect(component.bpTrendDataArr.length).toBe(0);
  });

  it('should have empty BPsysrange array', () => {
    expect(component.BPsysrange.length).toBe(0);
  });

  it('should have empty BPdiasrange array', () => {
    expect(component.BPdiasrange.length).toBe(0);
  });

  it('should have empty BPsysresult array', () => {
    expect(component.BPsysresult.length).toBe(0);
  });

  it('should have empty BPdiasresult array', () => {
    expect(component.BPdiasresult.length).toBe(0);
  });
  describe('dataProcessing()', () => {
    beforeEach(() => {
      component.bpReport = {
        bpPieCharReport: {
          alertHyperCount: 1,
          alertHypoCount: 2,
          goodNormalCount: 3,
          highAlertHyperCount: 4,
          highAlertHypoCount: 5
        }
      };
      component.dataProcessing();
    });

    it('should update bpTrendDataArr array with data from bpReport', () => {
      expect(component.bpTrendDataArr.length).toBe(5);
    });
  });
});
