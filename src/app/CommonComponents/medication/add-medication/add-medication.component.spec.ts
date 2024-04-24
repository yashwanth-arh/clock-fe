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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
import { AppModule, CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';

import { AddMedicationComponent } from './add-medication.component';

describe('AddMedicationComponent', () => {
  let component: AddMedicationComponent;
  let fixture: ComponentFixture<AddMedicationComponent>;
  let appModule = new AppModule();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMedicationComponent],
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
    fixture = TestBed.createComponent(AddMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.title').textContent).toContain('Edit Medication');
  });

  it('should initialize medicationForm correctly', () => {
    expect(component.medicationForm).toBeDefined();
  });

  it('should require medicineName', () => {
    const medicineName = component.medicationForm.controls['medicineName'];
    expect(medicineName.valid).toBeFalsy();

    medicineName.setValue('Test Medicine');
    expect(medicineName.valid).toBeTruthy();
  });

  it('should require medicineDose', () => {
    const medicineDose = component.medicationForm.controls['medicineDose'];
    expect(medicineDose.valid).toBeFalsy();

    medicineDose.setValue(10);
    expect(medicineDose.valid).toBeTruthy();
  });

  it('should require duration', () => {
    const duration = component.medicationForm.controls['duration'];
    expect(duration.valid).toBeFalsy();

    duration.setValue(7);
    expect(duration.valid).toBeTruthy();
  });

  it('should have valid options for medicineUnit', () => {
    const medicineUnit = component.medicationForm.controls['medicineUnit'];
    expect(medicineUnit.valid).toBeTruthy();

    const options = ['mg', 'gm', 'mcg', 'ml', 'oz', 'IU'];
    for (const option of options) {
      medicineUnit.setValue(option);
      expect(medicineUnit.valid).toBeTruthy();
    }
  });

  it('should have valid options for route', () => {
    const route = component.medicationForm.controls['route'];
    expect(route.valid).toBeTruthy();

    const options = ['Oral', 'Sublingual', 'IV', 'IM', 'SC', 'Intra Dermal', 'Inhalation/Nebulization', 'Local Application', 'Eye Drops', 'Ear Drops', 'Nasal Drops'];
    for (const option of options) {
      route.setValue(option);
      expect(route.valid).toBeTruthy();
    }
  });

  it('should have valid options for formulation', () => {
    const formulation = component.medicationForm.controls['formulation'];
    expect(formulation.valid).toBeTruthy();

    const options = ['Tab.', 'Cap.', 'Syr.', 'Inj.', 'Inhalation', 'Eye Drops', 'Ear Drops', 'Nasal Drops', 'Cream/Ointments', 'Sachets'];
    for (const option of options) {
      formulation.setValue(option);
      expect(formulation.valid).toBeTruthy();
    }
  });

  it('should have valid options for frequency', () => {
    const frequency = component.medicationForm.controls['frequency'];
    expect(frequency.valid).toBeTruthy();

    const options = ['Once a day', 'Two times a day', 'Three times a day', 'Four times a day', 'As needed', 'Before meals', 'After meals'];
    for (const option of options) {
      frequency.setValue(option);
      expect(frequency.valid).toBeTruthy();
    }
  });

});
