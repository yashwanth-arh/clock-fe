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
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { AppModule, CustomLayoutGapStyleBuilder } from '../app.module';
import { CheckOsType } from '../core/interceptors/check-os-type';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaregiverComponent } from './caregiver.component';
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
import { AngularMaterialModule } from '../angular-material.module';
import { AppRoutingModule } from '../app-routing.module';
import { SettingsStateService } from '../core/services/settings-state.service';
import { SnackbarService } from '../core/services/snackbar.service';
import { PushNotificationService } from '../Firebase Service/push-notification.service';
import { WeightPipe } from '../shared/pipes/weight.pipe';
import { DeviceService } from '../twilio/services/device.service';
import { StorageService } from '../twilio/services/storage.service';
import { VideoChatService } from '../twilio/services/videochat.service';
import { CaregiverService } from './caregiver.service';
import { of } from 'rxjs';

describe('CaregiverComponent', () => {
  let component: CaregiverComponent;
  let fixture: ComponentFixture<CaregiverComponent>;
  let appModule = new AppModule();
  let caregiverService: CaregiverService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaregiverComponent],
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
        CaregiverService,
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
    fixture = TestBed.createComponent(CaregiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    caregiverService = TestBed.inject(CaregiverService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load caregivers on init', () => {
    spyOn(caregiverService, 'getAllCaregivers').and.returnValue(of({}));
    component.ngOnInit();
    expect(caregiverService.getAllCaregivers).toHaveBeenCalledWith(0, 10, 'creationDate,desc', '', '', '');
  });
  it('should set the displayed columns', () => {
    expect(component.displayedColumns).toEqual([
      'name',
      'branchName',
      'email',
      'contactNo',
      'state',
      'city',
      'status',
      'action',
    ]);
  });
  it('should set the page size options', () => {
    expect(component.pageSizeOptions).toEqual([10, 25, 100]);
  });
  it('should load caregivers when the paginator or sort changes', () => {
    spyOn(component.dataSource, 'loadCaregivers');
    component.sort.sortChange.emit();
    expect(component.dataSource.loadCaregivers).toHaveBeenCalledWith(0, 10, 'creationDate', 'desc', '', '', '');
    component.paginator.page.emit();
    expect(component.dataSource.loadCaregivers).toHaveBeenCalledWith(0, 10, 'creationDate', 'desc', '', '', '');
  });
  it('should load caregivers on init', () => {
    spyOn(caregiverService, 'getAllCaregivers').and.returnValue(of({}));
    component.ngOnInit();
    expect(caregiverService.getAllCaregivers).toHaveBeenCalledWith(0, 10, 'creationDate,desc', '', '', '');
  });
  it('should set the displayed columns', () => {
    expect(component.displayedColumns).toEqual([
      'name',
      'branchName',
      'email',
      'contactNo',
      'state',
      'city',
      'status',
      'action',
    ]);
  });
  it('should set the page size options', () => {
    expect(component.pageSizeOptions).toEqual([10, 25, 100]);
  });
  it('should load caregivers when the paginator or sort changes', () => {
    spyOn(component.dataSource, 'loadCaregivers');
    component.sort.sortChange.emit();
    expect(component.dataSource.loadCaregivers).toHaveBeenCalledWith(0, 10, 'creationDate', 'desc', '', '', '');
    component.paginator.page.emit();
    expect(component.dataSource.loadCaregivers).toHaveBeenCalledWith(0, 10, 'creationDate', 'desc', '', '', '');
  });
});
