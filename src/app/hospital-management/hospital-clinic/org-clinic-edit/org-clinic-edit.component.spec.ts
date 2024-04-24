import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrgClinicEditComponent } from './org-clinic-edit.component';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BranchService } from 'src/app/branches/branch/branch.service';
import { of, throwError } from 'rxjs';
import { LocationService } from 'src/app/core/services/location.service';

describe('OrgClinicEditComponent', () => {
  let component: OrgClinicEditComponent;
  let fixture: ComponentFixture<OrgClinicEditComponent>;
  let appModule = new AppModule();
  let branchServiceSpy: jasmine.SpyObj<BranchService>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<OrgClinicEditComponent>>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let mockLocationService: any;

  beforeEach(async () => {
    branchServiceSpy = jasmine.createSpyObj(
      'BranchService',
      ['getAllBranch'],
      ['addBranch']
    );
    matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockLocationService = jasmine.createSpyObj(['getJSONData']);
    await TestBed.configureTestingModule({
      declarations: [OrgClinicEditComponent],
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
        MatAutocompleteModule,
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
        { provide: BranchService, useValue: branchServiceSpy },
        { provide: HTTP_INTERCEPTORS, useClass: CheckOsType, multi: true },
        {
          provide: LayoutGapStyleBuilder,
          useClass: CustomLayoutGapStyleBuilder,
        },
        { provide: LocationService, useValue: mockLocationService },

        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgClinicEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize the form', () => {
    component.ngOnInit();
    expect(component.orgBranchForm).toBeDefined();
  });
  
  it('should initialize form with correct default values', () => {
    expect(component.orgBranchForm.value).toEqual({
      name: null,
      primaryContactNumber: null,
      emergencyContactNumber: null,
      city: null,
      state: null,
      addressLine: null,
      zipCode: null,
      clinicNPI: null,
      status: null,
    });
  });

  it('should fill form fields with data when passed via @Input()', () => {
    component.data = {
      name: null,
      primaryContactNumber: null,
      emergencyContactNumber: null,
      city: null,
      state: null,
      addressLine: null,
      zipCode: null,
      clinicNPI: null,
      status: null,
    };
    fixture.detectChanges();

    expect(component.orgBranchForm.value).toEqual({
      name: null,
      primaryContactNumber: null,
      emergencyContactNumber: null,
      city: null,
      state: null,
      addressLine: null,
      zipCode: null,
      clinicNPI: null,
      status: null,
    });
  });
  it('should make the form valid when all required fields are filled', () => {
    component.ngOnInit();
    component.orgBranchForm.get('name').setValue('Test Clinic');
    component.orgBranchForm.get('primaryContactNumber').setValue('1234567890');
    component.orgBranchForm.get('city').setValue('New York');
    component.orgBranchForm.get('state').setValue('New York');
    component.orgBranchForm.get('zipCode').setValue('12345');
    component.orgBranchForm.get('clinicNPI').setValue('1234567890123456');
    component.orgBranchForm.get('status').setValue('ACTIVE');
    expect(component.orgBranchForm.valid).toBeTruthy();
  });
  it('should make the form invalid when a required field is missing', () => {
    component.ngOnInit();
    component.orgBranchForm.get('name').setValue('Test Clinic');
    component.orgBranchForm.get('primaryContactNumber').setValue('1234567890');
    component.orgBranchForm.get('city').setValue('New York');
    component.orgBranchForm.get('state').setValue('New York');
    component.orgBranchForm.get('zipCode').setValue('12345');
    component.orgBranchForm.get('clinicNPI').setValue('1234567890123456');
    expect(component.orgBranchForm.valid).toBeFalsy();
  });
});
