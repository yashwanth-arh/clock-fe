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
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime-ex';
import { ChartsModule } from 'ng2-charts';
import { of } from 'rxjs';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule, CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import { ConfirmDialogModel } from 'src/app/CommonComponents/confirm-dialog/confirm-dialog.component';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { DeviceTypeService } from 'src/app/settings-management/services/device-type.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';

import { AddVendorsComponent } from './add-vendors.component';

describe('AddVendorsComponent', () => {
  let component: AddVendorsComponent;
  let fixture: ComponentFixture<AddVendorsComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddVendorsComponent>>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<SnackbarService>;
  let deviceTypeServiceSpy: jasmine.SpyObj<DeviceTypeService>;
  let appModule = new AppModule();

  beforeEach(async () => {
    const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpyObj = jasmine.createSpyObj('SnackbarService', ['success']);
    const deviceTypeServiceSpyObj = jasmine.createSpyObj('DeviceTypeService', [
      'createVendor',
      'updateVendor',
    ]);
    await TestBed.configureTestingModule({
      declarations: [AddVendorsComponent],
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
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<AddVendorsComponent>
    >;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBarSpy = TestBed.inject(
      SnackbarService
    ) as jasmine.SpyObj<SnackbarService>;
    deviceTypeServiceSpy = TestBed.inject(
      DeviceTypeService
    ) as jasmine.SpyObj<DeviceTypeService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initializeCreateDeviceForm', () => {
    it('should initialize the form', () => {
      component.data = {
        vendorName: 'testVendorName',
      } as unknown as ConfirmDialogModel;
      component.initializeCreateDeviceForm();

      expect(component.vendorForm.get('vendorName').value).toBe(
        'testVendorName'
      );
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      component.vendorForm = new FormGroup({
        vendorName: new FormControl('testVendorName', Validators.required),
      });
    });

    it('should create a vendor', () => {
      const response = { success: true };
      deviceTypeServiceSpy.createVendor.and.returnValue(of(response));
      component.dataValue = 'add';
      component.vendorForm.setValue({ vendorName: 'test' });
      component.submit();
      expect(deviceTypeServiceSpy.createVendor).toHaveBeenCalledWith({
        vendorName: 'test',
      });
      expect(snackBarSpy.success).toHaveBeenCalledWith(
        'Vendor created successfully'
      );
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });

    it('should update a vendor', () => {
      component.dataValue = 'edit';
      component.data = { id: 1 } as unknown as ConfirmDialogModel;
      deviceTypeServiceSpy.updateVendor.and.returnValue(of({}));
      component.submit();
      expect(deviceTypeServiceSpy.updateVendor).toHaveBeenCalledWith(
        component.vendorForm.value,
        1
      );
      expect(snackBarSpy.success).toHaveBeenCalledWith(
        'Vendor updated successfully'
      );
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  });
});
