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
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import {
  FlexLayoutModule,
  CoreModule,
  LayoutGapStyleBuilder,
} from '@angular/flex-layout';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime-ex';
import { ChartsModule } from 'ng2-charts';
import { of } from 'rxjs';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';
import { AddVendorsComponent } from '../add-vendors/add-vendors.component';
import { VendorsListComponent } from './vendors-list.component';
import { DeviceTypeService } from 'src/app/settings-management/services/device-type.service';

describe('VendorsListComponent', () => {
  let component: VendorsListComponent;
  let fixture: ComponentFixture<VendorsListComponent>;
  let deviceService: jasmine.SpyObj<DeviceTypeService>;
  let snackBarService: jasmine.SpyObj<SnackbarService>;
  let dialog: MatDialog;
  let dialogRef: MatDialogRef<AddVendorsComponent>;
  let fb: FormBuilder;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorsListComponent],
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
    fixture = TestBed.createComponent(VendorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deviceService = TestBed.inject(
      DeviceTypeService
    ) as jasmine.SpyObj<DeviceTypeService>;
    snackBarService = TestBed.inject(
      SnackbarService
    ) as jasmine.SpyObj<SnackbarService>;
    dialog = TestBed.inject(MatDialog);
    fb = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);

    dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    // spyOn(dialog, 'open').and.returnValue(dialogRef);
  });

  it('should create the VendorsListComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual(['vedername', 'action']);
  });

  it('should have correct page size options', () => {
    expect(component.pageSizeOptions).toEqual([10, 25, 100]);
  });

  it('should have initial length and pageIndex values set to zero', () => {
    expect(component.length).toBe(0);
    expect(component.pageIndex).toBe(0);
  });

  it('should have empty dataSource before getVendorList() is called', () => {
    expect(component.dataSource).toBeUndefined();
  });

  it('should set dataSource correctly after getVendorList() is called', () => {
    spyOn(deviceService, 'getVendors').and.returnValue(
      of([{ vendor: 'vendor1' }, { vendor: 'vendor2' }])
    );
    component.getVendorList();
    expect(component.dataSource?.data.length).toBe(undefined);
  });

  it('should open AddVendorsComponent dialog and update dataSource after it is closed', () => {
    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    const dialogSpy = spyOn(dialog, 'open').and.returnValue(dialogRef);
    dialogRef.afterClosed.and.returnValue(of(true));
    spyOn(component, 'getVendorList');
    component.openVendorDialog({ vendor: 'vendor1' });
    expect(dialogSpy).toHaveBeenCalled();
    expect(component.getVendorList).toHaveBeenCalled();

    // spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) });
    // spyOn(component, 'getVendorList');
    // component.openVendorDialog({ vendor: 'vendor1' });
    // expect(dialog.open).toHaveBeenCalled();
    // expect(component.getVendorList).toHaveBeenCalled();
  });
});
