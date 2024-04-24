import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceModelListComponent } from './device-model-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  MatDialogConfig,
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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
// import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';
import { DeviceModelDialogComponent } from '../device-model-dialog/device-model-dialog.component';
import { of, throwError } from 'rxjs';
import { DeviceModelService } from '../device-model.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
// import { SnackbarService } from '../../../core/services/snackbar.service';
describe('DeviceModelListComponent', () => {
  let component: DeviceModelListComponent;
  let fixture: ComponentFixture<DeviceModelListComponent>;
  let deviceModelservice: DeviceModelService;
  let snackBarService: SnackbarService;
  let appModule = new AppModule();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceModelListComponent],
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
        DeviceModelService,
        // SnackbarService,
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
    fixture = TestBed.createComponent(DeviceModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deviceModelservice = TestBed.inject(DeviceModelService);
    snackBarService = TestBed.inject(SnackbarService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the deviceModelfilter form group', () => {
    expect(component.deviceModelfilter).toBeDefined();
    expect(component.deviceModelfilter.controls.searchQuery).toBeDefined();
    expect(component.deviceModelfilter.controls.searchQuery.value).toBe('');
  });
  it('should open the DeviceModelDialogComponent', () => {
    spyOn(component.entityModalPopup, 'open').and.returnValue({
      afterClosed: () => of(true),
    } as MatDialogRef<any>);
    component.addDeviceModel({});
    expect(component.entityModalPopup.open).toHaveBeenCalledWith(
      DeviceModelDialogComponent,
      jasmine.any(Object)
    );
  });

  it('should add device model', () => {
    const createEntityModalConfig = new MatDialogConfig();
    createEntityModalConfig.disableClose = true;
    createEntityModalConfig.maxWidth = '100vw';
    createEntityModalConfig.maxHeight = '120vh';
    createEntityModalConfig.width = '600px';
    createEntityModalConfig.data = null;
    spyOn(component.entityModalPopup, 'open').and.returnValue({
      afterClosed: () => of('dialog closed'),
    } as MatDialogRef<DeviceModelDialogComponent>);
    component.addDeviceModel(null);
    expect(component.entityModalPopup.open).toHaveBeenCalledWith(
      DeviceModelDialogComponent,
      createEntityModalConfig
    );
  });

  it('should update the page index and call getDeviceModels', () => {
    spyOn(component, 'getDeviceModels');
    component.handlePageEvent({
      length: 10,
      pageIndex: 0,
      pageSize: 10,
    } as PageEvent);
    expect(component.length).toBe(10);
    expect(component.pageIndex).toBe(0);
    expect(component.getDeviceModels).toHaveBeenCalledWith(0, 10);
  });

  it('should call deviceModelservice correctly', () => {
    spyOn(component.deviceModelservice, 'getAllModels').and.returnValue(
      of({ content: [], totalElements: 0 })
    );
    component.getDeviceModels(1, 10);
    expect(component.deviceModelservice.getAllModels).toHaveBeenCalledWith(
      1,
      10
    );
    expect(component.dataSource).toBeDefined();
    expect(component.length).toBe(0);
    expect(component.pageIndex).toBe(1);
  });

  // it('should call deviceModelservice correctly and reset the page index', () => {
  //   spyOn(component.deviceModelservice, 'getAllModels').and.returnValue(
  //     of({ content: [], totalElements: 0 })
  //   );
  //   component.paginator.pageIndex = 1;
  //   component.onDeviceModelFilter();
  //   expect(component.paginator.pageIndex).toBe(0);
  //   expect(component.deviceModelservice.getAllModels).toHaveBeenCalledWith(
  //     0,
  //     10,
  //     undefined,
  //     undefined,
  //     null
  //   );
  //   expect(component.dataSource).toBeDefined();
  //   expect(component.length).toBe(0);
  // });

  describe('unselectGlobalSearch', () => {
    it('should reset the search query and set the page index to 0', () => {
      // Arrange
      const paginator = component.paginator;
      paginator.pageIndex = 2;
      component.deviceModelfilter.get('searchQuery').setValue('test query');

      // Act
      component.unselectGlobalSearch();

      // Assert
      expect(paginator.pageIndex).toBe(0);
      expect(component.deviceModelfilter.get('searchQuery').value).toBeNull();
      // You may want to add more assertions depending on what else this method does
    });
  });

  describe('isEnableGlobalSearchFunc', () => {
    it('should call onDeviceModelFilter and set isEnableGlobalSearch to true if the search query is longer than 2 characters', () => {
      // Arrange
      const searchQueryControl = component.deviceModelfilter.get('searchQuery');
      spyOn(component, 'onDeviceModelFilter');

      // Act
      searchQueryControl.setValue('test query');
      component.isEnableGlobalSearchFunc();

      // Assert
      expect(component.onDeviceModelFilter).toHaveBeenCalled();
      expect(component.isEnableGlobalSearch).toBeTrue();
    });

    it('should call getDeviceModels and set isEnableGlobalSearch to false if the search query is empty', () => {
      // Arrange
      spyOn(component, 'getDeviceModels');

      // Act
      component.deviceModelfilter.get('searchQuery').setValue('');
      component.isEnableGlobalSearchFunc();

      // Assert
      expect(component.getDeviceModels).toHaveBeenCalled();
      expect(component.isEnableGlobalSearch).toBeFalse();
    });

    // You may want to add more test cases depending on what else this method does
  });
});
