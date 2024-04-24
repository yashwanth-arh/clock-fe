import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PatientObservationComponent } from './patient-observation.component';
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
import { BrowserModule, By } from '@angular/platform-browser';
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
import { DebugElement } from '@angular/core';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
describe('PatientObservationComponent', () => {
  let component: PatientObservationComponent;
  let fixture: ComponentFixture<PatientObservationComponent>;
  let appModule = new AppModule();
  let menu: DebugElement;
  let menuTrigger: DebugElement;
  let localStorageSpy: jasmine.SpyObj<Storage>;
  let caregiverDashbaordservice: any;
  let caregiverSharedService: CaregiverSharedService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientObservationComponent],
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
        DecimalPipe, MatSnackBar, CaregiverSharedService,
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
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem']);
    caregiverDashbaordservice = jasmine.createSpyObj('CaregiverDashbaordService', ['getObservationHistoryByPIddate']);
    fixture = TestBed.createComponent(PatientObservationComponent);
    component = fixture.componentInstance;
    menuTrigger = fixture.debugElement.query(By.css('span[matMenuTriggerFor]'));
    spyOn(component, 'loadData')
    fixture.detectChanges();
    menu = fixture.debugElement.query(By.css('mat-menu'));
    caregiverSharedService = TestBed.inject(CaregiverSharedService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default values on load', () => {
    component.onLoad();

    expect(component.observationStartDate).toBeDefined();
    expect(component.observationEndDate).toBeDefined();
    expect(component.ObsTodate).toBeDefined();
    expect(component.Obsfromdate).toBeDefined();
  });

  it('should create the component', () => {
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('span')).nativeElement;
    const absPath = "http://localhost:9876/assets/"
    expect(span).toBeTruthy();
    const imgs = document.querySelectorAll('img');
    expect(imgs).toBeTruthy();
    expect(imgs[0].src).toContain(absPath+'svg/DashboardIcons/Obs%20Date.svg');
    expect(imgs[1].src).toContain(absPath+'svg/Sort.svg');
  });

  it('should set symptomsBp to an empty object if it is NULL', () => {
    const filetredBPlist = { symptomsBp: null };
    component.getSymptomBP(filetredBPlist);
    fixture.detectChanges();
    expect(filetredBPlist.symptomsBp).toEqual({});
  });

  it('should set symptomsBp to an empty array if it is NULL', () => {
    const filetredBPlist = { symptomsBp: 'NULL' };
    component.getSymptomBP(filetredBPlist);
    fixture.detectChanges();
    expect(filetredBPlist.symptomsBp).toEqual([]);
  });

  it('should set symptomsBs to an empty object if it is NULL', () => {
    const filetredBGlist = { symptomsBS: null };
    component.getSymptomBS(filetredBGlist);
    fixture.detectChanges();
    expect(filetredBGlist.symptomsBS).toEqual({});
  });

  it('should set symptomsBs to an empty array if it is NULL', () => {
    const filetredBGlist = { symptomsBS: 'NULL' };
    component.getSymptomBS(filetredBGlist);
    fixture.detectChanges();
    expect(filetredBGlist.symptomsBS).toEqual([]);
  });

  it('should select green zone', () => {
    component.filterByZone('3');
    expect(component.selectedGreenZone).toBeTruthy();
    expect(component.selectedRedZone).toBeFalsy();
    expect(component.selectedOrangeZone).toBeFalsy();
    expect(component.selectedAllZone).toBeFalsy();
    expect(component.selectedNonAdherence).toBeFalsy();
    expect(component.dayObservationlist).toEqual([]);
    expect(component.observationStartDate).toEqual(new Date(localStorage.getItem('currentFromDate')));
    expect(component.observationEndDate).toEqual(new Date(localStorage.getItem('currentToDate')));
    expect(component.loadData).toHaveBeenCalledWith('3');
  });

  it('should select red zone', () => {
    component.filterByZone('1');
    expect(component.selectedGreenZone).toBeFalsy();
    expect(component.selectedRedZone).toBeTruthy();
    expect(component.selectedOrangeZone).toBeFalsy();
    expect(component.selectedAllZone).toBeFalsy();
    expect(component.selectedNonAdherence).toBeFalsy();
    expect(component.dayObservationlist).toEqual([]);
    expect(component.observationStartDate).toEqual(new Date(localStorage.getItem('currentFromDate')));
    expect(component.observationEndDate).toEqual(new Date(localStorage.getItem('currentToDate')));
    expect(component.loadData).toHaveBeenCalledWith('1');
  });

  it('should select orange zone', () => {
    component.filterByZone('2');
    expect(component.selectedGreenZone).toBeFalsy();
    expect(component.selectedRedZone).toBeFalsy();
    expect(component.selectedOrangeZone).toBeTruthy();
    expect(component.selectedAllZone).toBeFalsy();
    expect(component.selectedNonAdherence).toBeFalsy();
    expect(component.dayObservationlist).toEqual([]);
    expect(component.observationStartDate).toEqual(new Date(localStorage.getItem('currentFromDate')));
    expect(component.observationEndDate).toEqual(new Date(localStorage.getItem('currentToDate')));
    expect(component.loadData).toHaveBeenCalledWith('2');
  });

  it('should select all zones', () => {
    component.filterByZone('');
    expect(component.selectedGreenZone).toBeFalsy();
    expect(component.selectedRedZone).toBeFalsy();
    expect(component.selectedOrangeZone).toBeFalsy();
    expect(component.selectedAllZone).toBeTruthy();
    expect(component.selectedNonAdherence).toBeFalsy();
    expect(component.dayObservationlist).toEqual([]);
    expect(component.observationStartDate).toEqual(new Date(localStorage.getItem('currentFromDate')));
    expect(component.observationEndDate).toEqual(new Date(localStorage.getItem('currentToDate')));
    expect(component.loadData).toHaveBeenCalledWith('');
  });

  it('should select non-adherence', () => {
    component.filterByZone(undefined);
    expect(component.selectedGreenZone).toBeFalsy();
    expect(component.selectedRedZone).toBeFalsy();
    expect(component.selectedOrangeZone).toBeFalsy();
    expect(component.selectedAllZone).toBeFalsy();
    expect(component.selectedNonAdherence).toBeTruthy();
    expect(component.dayObservationlist).toEqual([]);
    expect(component.observationStartDate).toEqual(new Date(localStorage.getItem('currentFromDate')));
    expect(component.observationEndDate).toEqual(new Date(localStorage.getItem('currentToDate')));
    expect(component.loadData).toHaveBeenCalledWith(undefined);
  });

  it('should set Obsfromdate and ObsTodate on component initialization', (done) => {
    const expectedObsTodate = new Date();
    expectedObsTodate.setDate(expectedObsTodate.getDate() + 1);

    component.onLoad();
    fixture.detectChanges();

    expect(component.ObsTodate).toEqual(expectedObsTodate);
    done()
  });

  it('should load patient observation data and set dataSource', fakeAsync(() => {
    component.loadData('');
    tick();
    expect(component.loadRes).toBeFalsy();
    expect(component.patientObservationDataSource).toBeDefined();
    expect(component.patientObservationDataSource.data).toEqual([]);
  }));

  it('should render table and check headers', () => {
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeTruthy();
    var tableRows = fixture.nativeElement.querySelectorAll('tr');
    expect(tableRows[0].children.length).toEqual(6)
    expect(tableRows[0].children[0].innerText.trim()).toEqual("Date")
    expect(tableRows[0].children[1].innerText.trim()).toEqual("Blood Pressure (mmHg)")
    expect(tableRows[0].children[2].innerText.trim()).toEqual("BP Symptoms/Triggers")
    expect(tableRows[0].children[3].innerText.trim()).toEqual("Blood Pressure (mmHg)")
    expect(tableRows[0].children[4].innerText.trim()).toEqual("BP Symptoms/Triggers")
  })

  // it('should set dateModified to true when data is provided', () => {
  //   const data = { id: 1, from: '2022-01-01', to: '2022-01-31' };
  //   spyOn(component.caregiverSharedService, 'formatDate').and.returnValue('2022-01-01');
  //   component.caregiverSharedService.triggerdDates.next(data);
  //   expect(component.dateModified).toBe(true);
  // });

  // it('should call the subscription to the triggerdDates Observable in the constructor', () => {
  //   spyOn(caregiverSharedService.triggerdDates, 'subscribe');
  //   fixture.detectChanges();
  //   expect(caregiverSharedService.triggerdDates.subscribe).toHaveBeenCalled();
  // });

  // it('should set dpid to patientId from localStorage when no data is provided', () => {
  //   localStorage.setItem('patientId', '5678');
  //   spyOn(localStorage, 'getItem').and.returnValue('5678');
  //   component.caregiverSharedService.triggerdDates.next({});
  //   expect(component.dpid).toBe('5678');
  // });

  it('should set `onBoradingDate` property when `triggeredPatientonBoardDate` emits a value', () => {
    const mockRes = '2022-03-15';
    spyOn(component.caregiverSharedService.triggerdDates, 'subscribe');
    component.caregiverSharedService.triggeredPatientonBoardDate.next(mockRes);
    expect(component.onBoradingDate).toEqual(mockRes);
    expect(component.caregiverSharedService.triggerdDates.subscribe).toHaveBeenCalled();
  });

  // it('should set the default values correctly', () => {

  //   const currentDate = new Date();
  //   const expectedFromDate = new Date();
  //   expectedFromDate.setDate(expectedFromDate.getDate() - 30);
  //   const expectedToDate = new Date();
  //   expectedToDate.setDate(expectedToDate.getDate() + 1);
  //   const expectedStartDate = expectedFromDate.toISOString().split('T')[0] + 'T' + '00:00:00';
  //   const expectedEndDate = expectedToDate.toISOString().split('T')[0] + 'T' + '23:59:59';
  //   component.onLoad();

  //   // localStorageSpy.getItem.and.returnValue('patientId');
  //   spyOn(component, 'getMonthCount').and.returnValue(30);
  //   spyOn(component.Obsfromdate, 'getDate').and.returnValue(currentDate.getDate());
  //   spyOn(component.Obsfromdate, 'setDate');
  //   spyOn(component.ObsTodate, 'getDate').and.returnValue(currentDate.getDate() + 1);
  //   spyOn(component.ObsTodate, 'setDate');

  //   component.onLoad();
  //   // expect(component.dpid).toBe('patientId');
  //   expect(component.Obsfromdate.setDate).toHaveBeenCalledWith(expectedFromDate.getDate());
  //   expect(component.ObsTodate.setDate).toHaveBeenCalledWith(expectedToDate.getDate());
  //   expect(component.observationStartDate).toBe(expectedStartDate);
  //   expect(component.observationEndDate).toBe(expectedEndDate);
  // });
});
