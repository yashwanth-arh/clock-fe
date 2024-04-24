import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpReadingsMapViewComponent } from './bp-readings-map-view.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { RouterModule } from '@angular/router';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
import { of } from 'rxjs';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
describe('BpReadingsMapViewComponent', () => {
  let dashboardService: jasmine.SpyObj<CaregiverDashboardService>;
  let component: BpReadingsMapViewComponent;
  let fixture: ComponentFixture<BpReadingsMapViewComponent>;
  let appModule = new AppModule();
  let mockDashboardService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BpReadingsMapViewComponent],
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
   
    const dashboardServiceSpy = jasmine.createSpyObj('CaregiverDashboardService', [
      'getBpAnalytics',
    ]);
    fixture = TestBed.createComponent(BpReadingsMapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dashboardService = TestBed.inject(CaregiverDashboardService) as jasmine.SpyObj<CaregiverDashboardService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('should call the `getReadings` method', () => {
  //   expect(dashboardService.getBpAnalytics).toHaveBeenCalled();
  // });
  it('should set the `patientId` property', () => {
    expect(component.patientId).toBeDefined();
  });
  it('should set the `requestBody` property', () => {
    expect(component.requestBody).toEqual({ patientId: component.patientId, type: 'day', value: '0' });
  });
  it('should return color red for zone 1', () => {
    const zone = 1;
    const result = component.getZoneColor(zone);
    expect(result).toBe('1');
  });
  it('should return color green for zone 2', () => {
    const zone = 2;
    const result = component.getZoneColor(zone);
    expect(result).toBe('2');
  });

  it('should return color blue for zone 3', () => {
    const zone = 3;
    const result = component.getZoneColor(zone);
    expect(result).toBe('3');
  });

  it('should return color black for zone 4', () => {
    const zone = 4;
    const result = component.getZoneColor(zone);
    expect(result).toBe('4');
  });
 
 

});
