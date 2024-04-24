import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDeviceComponent } from './assign-device.component';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { AppModule, CustomLayoutGapStyleBuilder } from 'src/app/app.module';
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
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';
import { HospitalManagementService } from 'src/app/hospital-management/service/hospital-management.service';
import { throwError,of } from 'rxjs';
import { DeviceManagementService } from '../../service/device.management.service';


describe('AssignDeviceComponent', () => {
  let component: AssignDeviceComponent;
  let fixture: ComponentFixture<AssignDeviceComponent>;
  let appModule = new AppModule();
  let hospitalServiceSpy: jasmine.SpyObj<HospitalManagementService>;
  let deviceServiceSpy: jasmine.SpyObj<DeviceManagementService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

  beforeEach(async () => {
    const deviceServiceSpyObj = jasmine.createSpyObj('DeviceManagementService', ['assignDevice']);
    const snackbarServiceSpyObj = jasmine.createSpyObj('SnackbarService', ['success', 'error']);
    const hospitalServiceSpyObj = jasmine.createSpyObj('HospitalManagementService', ['getPracticeList']);

    await TestBed.configureTestingModule({
      declarations: [AssignDeviceComponent],
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
        { provide: HTTP_INTERCEPTORS, useClass: CheckOsType, multi: true },
        { provide: LayoutGapStyleBuilder,useClass: CustomLayoutGapStyleBuilder },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: DeviceManagementService, useValue: deviceServiceSpyObj },
        { provide: SnackbarService, useValue: snackbarServiceSpyObj },
        { provide: HospitalManagementService, useValue: hospitalServiceSpyObj }

      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    hospitalServiceSpy = TestBed.inject(HospitalManagementService) as jasmine.SpyObj<HospitalManagementService>;
    deviceServiceSpy = TestBed.inject(DeviceManagementService) as jasmine.SpyObj<DeviceManagementService>;
    snackbarServiceSpy = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call hospitalService.getPracticeList on init', () => {
    const practiceList = [{ id: 1, name: 'Practice 1' }, { id: 2, name: 'Practice 2' }];
    hospitalServiceSpy?.getPracticeList.and?.returnValue(of({ hospitalList: practiceList }));
    component.ngOnInit();
    expect(hospitalServiceSpy?.getPracticeList).toHaveBeenCalled();
    expect(component.practiceList).toEqual(practiceList);
  });
  it('should not submit form if invalid', () => {
    component.assignDevice.setValue({ hospitalId: '' });
    component.onSubmit();
    expect(deviceServiceSpy?.assignDevice).not.toHaveBeenCalled();
    expect(snackbarServiceSpy.success).not.toHaveBeenCalled();
    expect(component.isSubmitted).toBeFalse();
  });
  it('should call hospitalService.getPracticeList() on init and populate practiceList', () => {
    const practiceList = [{ id: 1, name: 'Practice 1' }, { id: 2, name: 'Practice 2' }];
    hospitalServiceSpy.getPracticeList.and.returnValue(of({ hospitalList: practiceList }));

    component.ngOnInit();

    expect(hospitalServiceSpy.getPracticeList).toHaveBeenCalled();
    expect(component.practiceList).toEqual(practiceList);
  });

  it('should show error snackbar if hospitalService.getPracticeList() fails', () => {
    const errorMessage = 'Error getting practice list.';
    hospitalServiceSpy.getPracticeList.and.returnValue(throwError({ message: errorMessage }));

    component.ngOnInit();

    expect(hospitalServiceSpy.getPracticeList).toHaveBeenCalled();
    // expect(snackBarServiceSpy.error).toHaveBeenCalledWith(errorMessage, 2000);
  });
  describe('ngOnInit', () => {
    it('should fetch practice list from hospitalService and set it to practiceList', () => {
      const practiceList = [{ id: 1, name: 'Practice 1' }, { id: 2, name: 'Practice 2' }];
      hospitalServiceSpy.getPracticeList.and.returnValue(of({ hospitalList: practiceList }));
      component.ngOnInit();
      expect(hospitalServiceSpy.getPracticeList).toHaveBeenCalled();
      expect(component.practiceList).toEqual(practiceList);
    });

    it('should not set practiceList if hospitalService.getPracticeList fails', () => {
      hospitalServiceSpy.getPracticeList.and.returnValue(throwError('Error'));

      component.ngOnInit();

      expect(hospitalServiceSpy.getPracticeList).toHaveBeenCalled();
      expect(component.practiceList).toEqual([]);
    });
  });
});
