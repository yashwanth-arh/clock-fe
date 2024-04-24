import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchAddEditComponent } from './branch-add-edit.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { RouterModule } from '@angular/router';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { MatSelectModule } from '@angular/material/select';
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
describe('BranchAddEditComponent', () => {
  let component: BranchAddEditComponent;
  let fixture: ComponentFixture<BranchAddEditComponent>;
  let appModule = new AppModule();
  let event: any;
  let mockState: any[];

  beforeEach(async () => {
    event = {
      target: {
        value: '  hello  '
      }
    };
    mockState = [
      { primary_city: 'New York' },
      { primary_city: 'Los Angeles' },
      { primary_city: 'Chicago' },
      { primary_city: 'Houston' }
    ];
    await TestBed.configureTestingModule({
      declarations: appModule.declarations,
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
        MatSelectModule,
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
    fixture = TestBed.createComponent(BranchAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the branchForm with null values', () => {
    component.data.value = null;
    component.initializeBranchAddEditForm();
    expect(component.branchForm.value).toEqual({
      clinicname: null,
      practice_name: null,
      econtact: null,
      pcontact: null,
      prname: null,
      prcontact: null,
      city_name: null,
      state_name: null,
      address: null,
      zip_code: null,
      clinic_npi: null,
      status: null,
    });
  });

  it('should set Validators for practice_name', () => {
    component.data.value = null;
    component.initializeBranchAddEditForm();
    const practice_name = component.branchForm.controls['practice_name'];
    expect(practice_name.valid).toBeFalsy();

    practice_name.setValue('123');
    expect(practice_name.valid).toBeTruthy();
  });

  it('should set Validators for clinicname', () => {
    component.data.value = null;
    component.initializeBranchAddEditForm();
    const clinicname = component.branchForm.controls['clinicname'];
    expect(clinicname.valid).toBeFalsy();

    

    clinicname.setValue('Test123');
    expect(clinicname.valid).toBeFalsy();

    clinicname.setValue('Test Clinic');
    expect(clinicname.valid).toBeTruthy();
  });

  it('should set Validators for econtact', () => {
    component.data.value = null;
    component.initializeBranchAddEditForm();
    const econtact = component.branchForm.controls['econtact'];
    expect(econtact.valid).toBeTruthy();

    econtact.setValue('123');
    expect(econtact.valid).toBeFalsy();

    econtact.setValue('123-456-7890');
  });

  it('should update the city list when given a valid state', () => {
    const mockEvent = 'New York';
    component.state = mockState;

    component.onStateSelection(mockEvent);

    expect(component.city).toEqual(['New York']);
  });


  
  
});


