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
import { AngularMaterialModule } from '../angular-material.module';
import { AppRoutingModule } from '../app-routing.module';
import { AppModule, CustomLayoutGapStyleBuilder } from '../app.module';
import { CheckOsType } from '../core/interceptors/check-os-type';
import { SettingsStateService } from '../core/services/settings-state.service';
import { SnackbarService } from '../core/services/snackbar.service';
import { PushNotificationService } from '../Firebase Service/push-notification.service';
import { WeightPipe } from '../shared/pipes/weight.pipe';
import { DeviceService } from '../twilio/services/device.service';
import { StorageService } from '../twilio/services/storage.service';
import { VideoChatService } from '../twilio/services/videochat.service';
import { By } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let appModule = new AppModule();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
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
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize the chart data', () => {
    expect(component.chartData).toEqual([
      component.barChartLabels,
      component.barChartData,
      component.chartType,
      component.hideTypeDropdown,
    ]);
  });
  it('should have the correct chart type', () => {
    expect(component.chartType).toBe('bar');
  });

  it('should have the correct chart labels', () => {
    expect(component.barChartLabels).toEqual([
      '2006',
      '2007',
      '2008',
      '2009',
      '2010',
      '2011',
      '2012',
    ]);
  });
  it('should have the correct chart data', () => {
    expect(component.barChartData).toEqual([
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Patients',
        stack: 'a',
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Doctors',
        stack: 'a',
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Clinic',
        stack: 'a',
      },
    ]);
  });

  it('should have the correct chart options', () => {
    expect(component.barChartOptions).toEqual({
      responsive: true,
    });
  });

  it('should not hide the type dropdown', () => {
    expect(component.hideTypeDropdown).toBe(false);
  });
  // it('should display the bar chart with correct data', () => {
  //   const chartElement = fixture.debugElement.query(By.css('canvas'))?.nativeElement;
  //   const chart = chartElement['chart'];

  //   expect(chart.config.type).toBe('bar');
  //   expect(chart.data.labels).toEqual(component.barChartLabels);
  //   expect(chart.data.datasets).toEqual(component.barChartData);
  // });

  it('should hide the type dropdown when hideTypeDropdown is true', () => {
    component.hideTypeDropdown = true;
    fixture.detectChanges();

    const dropdownElement = fixture.debugElement.query(By.css('.dropdown'));
    expect(dropdownElement).toBeNull();
  });

  // it('should show the type dropdown when hideTypeDropdown is false', () => {
  //   component.hideTypeDropdown = false;
  //   fixture.detectChanges();

  //   const dropdownElement = fixture.debugElement.query(By.css('.dropdown'));
  //   expect(dropdownElement).not.toBeNull();
  // });
});
