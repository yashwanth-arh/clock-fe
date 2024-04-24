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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { of } from 'rxjs';
import { EditBaselineBpComponent } from '../../../app/CommonComponents/edit-baseline-bp/edit-baseline-bp.component';
import { PatientDetailspageHeaderComponent } from './patient-detailspage-header.component';

describe('PatientDetailspageHeaderComponent', () => {
  let component: PatientDetailspageHeaderComponent;
  let fixture: ComponentFixture<PatientDetailspageHeaderComponent>;
  let appModule = new AppModule();
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientDetailspageHeaderComponent],
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
    fixture = TestBed.createComponent(PatientDetailspageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    // component = new PatientDetailspageHeaderComponent('','');
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get currentPatientId from localStorage', () => {
    localStorage.setItem('patientId', '1234');
    component.ngOnInit();
    expect(component.currentPatientId).toEqual('1234');
  });
  it('should get observations when triggeredPatientCard emits data', () => {
    spyOn(component, 'getObsById');
    component.caregiversharedService.triggeredPatientCard.next(true);
    expect(component.getObsById).toHaveBeenCalledWith(component.currentPatientId);
  });
  it('should get average BP when triggeredDates emits data with "from" and "to"', () => {
    spyOn(component, 'getAverageBP');
    component.caregiversharedService.triggerdDates.next({
      from: '2023-03-01',
      to: '2023-03-07',
    });
    expect(component.getAverageBP).toHaveBeenCalledWith({
      dateFrom: '2023-03-01',
      dateTo: '2023-03-07',
    }, component.dpid);
  });
  it('should get timers from claimTimerService', () => {
    spyOn(component.claimTimerService, 'getTimerObjVal').and.returnValue(1234);
    component.ngOnInit();
    expect(component.dashboardTimer).toEqual(1234);
    expect(component.graphTimer).toEqual(1234);
    expect(component.clinicalNotesTimer).toEqual(1234);
  });
  // it('should toggle patient drawer when triggeredPatientDrawer emits data and profileShowDrawer is true', () => {
  //   component.profileShowDrawer = true;
  //   spyOn(component.pdrawer, 'toggle');
  //   component.caregiversharedService.triggeredPatientDrawer.next(true);
  //   expect(component.pdrawer.toggle).toHaveBeenCalled();
  // });

  it('should get latest readings when triggeredAppts emits data', () => {
    spyOn(component, 'getLatestReadings');
    component.caregiversharedService.triggeredAppts.next(true);
    expect(component.getLatestReadings).toHaveBeenCalledWith(component.dpid);
  });

  it('should store timerObj in localStorage if it does not exist', () => {
    component.ngOnInit();
    expect(localStorage.getItem(`timerObj_${component.currentPatientId}`)).toBeDefined();
  });
  // it('should open the edit baseline dialog with the correct config', () => {
  //   // Arrange
  //   const sys = 120;
  //   const dia = 80;
  //   const id = 123;
  //   const expectedConfig = new MatDialogConfig();
  //   expectedConfig.disableClose = true;
  //   expectedConfig.maxWidth = '100vw';
  //   expectedConfig.maxHeight = '100vh';
  //   expectedConfig.width = '35%';
  //   expectedConfig.data = { data: sys, dia, id };
  //   const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of(true) });
  //   dialogSpy.open.and.returnValue(dialogRefSpyObj);

  //   // Act
  //   component.editBaselinebp(sys, dia, id);

  //   // Assert
  //   expect(dialogSpy.open).toHaveBeenCalledWith(
  //     EditBaselineBpComponent,
  //     expectedConfig
  //   );
  // });
  
});
