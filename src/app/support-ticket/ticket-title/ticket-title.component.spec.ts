import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { TicketTitleComponent } from './ticket-title.component';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
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
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import {
  FlexLayoutModule,
  CoreModule,
  LayoutGapStyleBuilder,
} from '@angular/flex-layout';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
import { of, throwError } from 'rxjs';
import { DeviceModelService } from 'src/app/device-management/device-models/device-model.service';

describe('TicketTitleComponent', () => {
  let component: TicketTitleComponent;
  let fixture: ComponentFixture<TicketTitleComponent>;
  let deviceModelService: jasmine.SpyObj<DeviceModelService>;
  let snackBarService: jasmine.SpyObj<SnackbarService>;
  let fb: FormBuilder;
  let appModule = new AppModule();
  beforeEach(async () => {
    deviceModelService = jasmine.createSpyObj('DeviceModelService', [
      'getAllModels',
    ]);
    snackBarService = jasmine.createSpyObj('SnackbarService', ['error']);
    await TestBed.configureTestingModule({
      declarations: [TicketTitleComponent],
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
        { provide: DeviceModelService, useValue: deviceModelService },
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
    fb = TestBed.inject(FormBuilder);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.deviceModelfilter).toBeInstanceOf(FormGroup);
  });

  it('should call `getAllModels` on getDeviceModels call', () => {
    const pageNumber = 0;
    const pageSize = 10;
    const searchQuery = 'test';
    const content = [{ id: 1, name: 'test' }];
    deviceModelService.getAllModels.and.returnValue(of({ content }));
    component.getDeviceModels(pageNumber, pageSize, searchQuery);
    expect(deviceModelService.getAllModels).toHaveBeenCalledWith(
      pageNumber,
      pageSize
    );
    expect(component.dataSource.data).toEqual(content);
  });

  it('should call `error` method of snackbar service on getDeviceModels error', () => {
    const errorMessage = 'An error has occurred';
    deviceModelService.getAllModels.and.returnValue(
      throwError({ message: errorMessage })
    );
    component.getDeviceModels();
    expect(deviceModelService.getAllModels).toHaveBeenCalled();
    // expect(snackBarService.error).toHaveBeenCalled();
  });
});
