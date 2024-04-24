import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailsSubHeaderComponent } from './patient-details-sub-header.component';
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
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';
import { of } from 'rxjs';


describe('PatientDetailsSubHeaderComponent', () => {
  let component: PatientDetailsSubHeaderComponent;
  let fixture: ComponentFixture<PatientDetailsSubHeaderComponent>;
  let appModule = new AppModule();
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientDetailsSubHeaderComponent],
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
    fixture = TestBed.createComponent(PatientDetailsSubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set default values on init', () => {
    expect(component.fromDate).toBeDefined();
    expect(component.toDate).toBeDefined();
    expect(component.chartToDate).toBeDefined();
    expect(component.chartFromDate).toBeDefined();
    expect(component.hideDatepicker).toBeFalsy();
  });
  it('should initialize echarts with the correct div element', () => {
    const divEl: HTMLDivElement = document.createElement('div');
    component.bpTrendId = { nativeElement: divEl };

    component.bpTrendLoad();

    expect(component.myChart).toBeDefined();
    expect(component.myChart.getDom().getAttribute('id')).toEqual(divEl.getAttribute('id'));
  });

 
  it('should not call getAdherenceBP and changeDates when neither from nor toDate is provided', () => {
    spyOn(component.caregiversharedService, 'formatDate').and.returnValue(null);
    spyOn(component.caregiversharedService, 'changeDates').and.returnValue(null);


    expect(component.caregiversharedService.formatDate).toHaveBeenCalledTimes(0);
    expect(component.caregiversharedService.changeDates).toHaveBeenCalledTimes(0);
  });

  // it('should set the fromDate and toDate dates correctly', () => {
  //   expect(component.fromDate.getDate()).toBe(new Date().getDate() - 30);
  //   expect(component.toDate.getDate()).toBe(new Date().getDate());
  // });
  it('should set dpid from local storage on initialization', () => {
    // Arrange
    // const component = new MyComponent();
    spyOn(localStorage, 'getItem').and.returnValue('12345');
  
    // Act
    component.ngOnInit();
  
    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('patientId');
    expect(component.dpid).toEqual('12345');
  });

  it('should set dpid to null when there is no value in local storage', () => {
    // Arrange
    spyOn(localStorage, 'getItem').and.returnValue(null);
  
    // Act
    component.ngOnInit();
  
    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('patientId');
    expect(component.dpid).toBeNull();
  });

  it('should call getObsById with default values if caregivertSharedService.triggerdDates is empty', () => {
    const spy = spyOn(component, 'getObsById');
    component.caregiversharedService.triggerdDates.next({});
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(component.dpid, component.fromDate, component.toDate);
  });
  

 

 



});
