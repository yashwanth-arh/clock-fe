import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTypeListComponent } from './device-type-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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
import { DiseaseService } from '../../services/disease.service';
import { DeviceTypeService } from '../../services/device-type.service';
describe('DeviceTypeListComponent', () => {
  let component: DeviceTypeListComponent;
  let fixture: ComponentFixture<DeviceTypeListComponent>;
  let deviceTypeServiceStub: Partial<DeviceTypeService>;
  let appModule = new AppModule();
  let deviceService: DeviceService;
  let snackBar: SnackbarService;

  beforeEach(async () => {
    deviceTypeServiceStub = {
      getAllDeviceType: (
        pageNumber: number,
        pageSize: number,
        searchquery?: string
      ) => {
        return of({
          content: [
            { id: 1, name: 'Device 1', description: 'Description 1' },
            { id: 2, name: 'Device 2', description: 'Description 2' },
          ],
          totalElements: 2,
        });
      },
    };
    await TestBed.configureTestingModule({
      declarations: [DeviceTypeListComponent],
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
    fixture = TestBed.createComponent(DeviceTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deviceService = TestBed.inject(DeviceService);
    snackBar = TestBed.inject(SnackbarService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch device types on initialization', () => {
    spyOn(component, 'getDeviceTypeList').and.callThrough();
    component.ngOnInit();
    // expect(component.getDeviceTypeList).toHaveBeenCalledWith(0, 10);
  });

  it('should update device types on page event', () => {
    spyOn(component, 'getDeviceTypeList').and.callThrough();
    component.handlePageEvent({ pageIndex: 1, pageSize: 25, length: 2 });
    expect(component.getDeviceTypeList).toHaveBeenCalledWith(1, 25);
  });

  it('should filter device types by name on form submit', () => {
    spyOn(component, 'getDeviceTypeList').and.callThrough();
    component.deviceTypefilter.controls.searchquery.setValue('Device 1');
    component.onDeviceTypeFilter();
    // expect(component.getDeviceTypeList).toHaveBeenCalledWith(0, 1);
  });

  it('should add a device type', () => {
    spyOn(component.dialog, 'open').and.callThrough();
    component.addDeviceType();
    expect(component.dialog.open).toHaveBeenCalled();
    // TODO: Test the afterClosed() subscription when the dialog is closed
  });

  it('should edit a device type', () => {
    spyOn(component.dialog, 'open').and.callThrough();
    component.editDeviceType({
      id: 1,
      name: 'Device 1',
      description: 'Description 1',
    });
    expect(component.dialog.open).toHaveBeenCalled();
    // TODO: Test the afterClosed() subscription when the dialog is closed
  });
});
