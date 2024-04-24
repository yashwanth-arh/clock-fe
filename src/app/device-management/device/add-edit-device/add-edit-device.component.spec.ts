import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditDeviceComponent } from './add-edit-device.component';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { DeviceManagementService } from '../../service/device.management.service';
import { of } from 'rxjs';
describe('AddEditDeviceComponent', () => {
  let component: AddEditDeviceComponent;
  let fixture: ComponentFixture<AddEditDeviceComponent>;
  let appModule = new AppModule();
  let dialogRef: MatDialogRef<DeviceManagementService>;
  let snackBarService: SnackbarService;
  // let mockDeviceService: jasmine.SpyObj<DeviceService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DeviceManagementService>>;
  // let mockSnackBarService: jasmine.SpyObj<SnackbarService>;
  let mockDeviceService = jasmine.createSpyObj('DeviceService', [
    'createDevice',
    'editDevice',
  ]);
  let mockSnackBarService = jasmine.createSpyObj('SnackBarService', [
    'success',
    'error',
  ]);
  beforeEach(async () => {

    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
 
    await TestBed.configureTestingModule({
      declarations: [AddEditDeviceComponent],
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
        MatSelectModule,
        MatDialogModule,
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
        { provide: DeviceService, useValue: mockDeviceService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: SnackbarService, useValue: mockSnackBarService },

      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogRef = TestBed.inject(MatDialogRef);
    snackBarService = TestBed.inject(SnackbarService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should validate form when all fields are filled', () => {
    component.addEditDevice.controls['deviceCode'].setValue('123');
    component.addEditDevice.controls['connectivity'].setValue('Wifi');
    component.addEditDevice.controls['deviceName'].setValue('Smartphone');
    component.addEditDevice.controls['deviceModelNo'].setValue('ABC123');
    component.addEditDevice.controls['vendorName'].setValue('Samsung');
    component.addEditDevice.controls['imeinumber'].setValue('1234567890');
    component.addEditDevice.controls['procurementDate'].setValue(new Date());
    component.addEditDevice.controls['deviceVersion'].setValue('1.0.0');
    component.addEditDevice.controls['price'].setValue(500);
    component.addEditDevice.controls['assignStatus'].setValue('Available');
    expect(component.addEditDevice.valid).toBeTruthy();
  });
  it('should invalidate form when required fields are not filled', () => {
    component.addEditDevice.controls['deviceCode'].setValue('');
    component.addEditDevice.controls['connectivity'].setValue('');
    component.addEditDevice.controls['deviceName'].setValue('');
    component.addEditDevice.controls['deviceModelNo'].setValue('');
    component.addEditDevice.controls['vendorName'].setValue('');
    component.addEditDevice.controls['imeinumber'].setValue('');
    component.addEditDevice.controls['procurementDate'].setValue('');
    component.addEditDevice.controls['deviceVersion'].setValue('');
    component.addEditDevice.controls['price'].setValue('');
    component.addEditDevice.controls['assignStatus'].setValue('');
    expect(component.addEditDevice.valid).toBeFalsy();
  });
  it('should invalidate form when device code is too short', () => {
    component.addEditDevice.controls['deviceCode'].setValue('12');
    expect(component.addEditDevice.valid).toBeFalsy();
  });
  // it('should submit the form', () => {
  //   const deviceService = TestBed.inject(DeviceManagementService);
  //   spyOn(deviceService, 'createDevice').and.callThrough();
  //   const formValue = {
  //     deviceCode: 'ABC',
  //     connectivity: 'wifi',
  //     category: 'mobile',
  //     deviceName: 'iPhone',
  //     deviceModelNo: '123',
  //     vendorName: 'Apple',
  //     imeinumber: '1234567890',
  //     procurementDate: new Date(),
  //     deviceVersion: '1.0',
  //     price: 1000,
  //     assignStatus: 'Assigned'
  //   };
  //   component.addEditDevice.setValue(formValue);
  //   component.onSubmit();
  //   expect(deviceService.createDevice).toHaveBeenCalledWith(formValue);
  //   expect(component.submitted).toBeTruthy();
  // });  
  it('should return early', () => {
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(snackBarService.success).not.toHaveBeenCalled();
    expect(snackBarService.error).not.toHaveBeenCalled();
  });
  describe('when the form is valid and add === "add"', () => {
    let formValue: any;

    beforeEach(() => {
      formValue = {
        deviceCode: '12345',
        vendorName: 'Test Vendor',
        deviceName: 'Test Device',
        connectivity: 'WIFI',
        procurementDate: new Date(),
        category: '',
        deviceModelNo: '123',
        imeinumber: '1234567890',
        deviceVersion: '1.0',
        price: 1000,
        assignStatus: 'Assigned'
      };
      component.addEditDevice.setValue(formValue);
      spyOn(formValue.procurementDate, 'setDate').and.callThrough();
      mockDeviceService.createDevice.and.returnValue(of({}));
      component.onSubmit();
    });

    // it('should call setDate on the procurementDate', () => {
    //   let procurementDate = new Date();
    //   spyOn(formValue.procurementDate, 'setDate').and.callThrough();

    //   component.onSubmit();

    //   expect(procurementDate.setDate).toHaveBeenCalledWith(
    //     // new Date(formValue.procurementDate).getDate() + 1
    //     15
    //   );
    // });

    it('should set submitted to false', () => {
      expect(component.submitted).toBeTrue ();
    });

    // it('should call success on the snackBarService', () => {
    //   component.onSubmit();
    //   expect(snackBarService.success).toHaveBeenCalledWith(
    //     'Created successfully!'
    //   );
    // });
  });
});
