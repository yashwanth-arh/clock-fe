import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { of } from 'rxjs';

import { AddDiseaseComponent } from './add-disease.component';
import { DiseaseService } from '../../services/disease.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
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
import { NO_ERRORS_SCHEMA } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime-ex';
import { ChartsModule } from 'ng2-charts';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';
import { Disease } from '../../entities/disease';

describe('AddDiseaseComponent', () => {
  let component: AddDiseaseComponent;
  let fixture: ComponentFixture<AddDiseaseComponent>;
  let diseaseServiceSpy: jasmine.SpyObj<DiseaseService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  const dialogRefSpyObj = jasmine.createSpyObj({
    close: () => {},
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDiseaseComponent],
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
      schemas: [NO_ERRORS_SCHEMA],
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
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: DiseaseService,
          useValue: {},
        },
        {
          provide: SnackbarService,
          useValue: jasmine.createSpyObj('SnackbarService', [
            'success',
            'error',
          ]),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiseaseComponent);
    component = fixture.componentInstance;
    diseaseServiceSpy = TestBed.inject(
      DiseaseService
    ) as jasmine.SpyObj<DiseaseService>;
    snackbarServiceSpy = TestBed.inject(
      SnackbarService
    ) as jasmine.SpyObj<SnackbarService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with required fields', () => {
    expect(component.addDiseaseForm.get('name')).toBeTruthy();
    expect(component.addDiseaseForm.get('id')).toBeTruthy();
  });

  it('should have fields property that returns the controls of the form', () => {
    expect(component.fields.name).toBe(component.addDiseaseForm.controls.name);
    expect(component.fields.id).toBe(component.addDiseaseForm.controls.id);
  });

  it('should close the dialog when closeDialog() is called', () => {
    spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  describe('onSubmit', () => {
    it('should not submit the form when it is invalid', () => {
      component.isSubmitted = true;
      component.addDiseaseForm.setErrors({ required: true });
      spyOn(component.diseaseService, 'createDisease');
      component.onSubmit();
      expect(component.diseaseService.createDisease).not.toHaveBeenCalled();
    });

    it('should submit the form when it is valid', () => {
      component.isSubmitted = true;
      component.addDiseaseForm.setValue({ name: 'Test Disease', id: '123' });
      spyOn(component.diseaseService, 'createDisease').and.returnValue(
        of({
          id: '123',
          name: 'Test Disease',
          description: 'Test description',
          code: '',
        } as Disease)
      );
      spyOn(component.snackBar, 'success');
      component.onSubmit();
      expect(component.diseaseService.createDisease).toHaveBeenCalledWith({
        id: '123',
        name: 'Test Disease',
        description: 'Test description',
        code: '',
      } as Disease);
      expect(component.snackBar.success).toHaveBeenCalledWith(
        'Disease added successfully!',
        2000
      );
      expect(component.addDiseaseForm.value).toEqual({ name: '', id: '' });
      expect(component.isSubmitted).toBe(false);
      expect(component.closeDialog).toHaveBeenCalled();
    });

    it('should show error message when submitting the form fails', () => {
      component.isSubmitted = true;
      component.addDiseaseForm.setValue({ name: 'Test Disease', id: '123' });
      spyOn(component.diseaseService, 'createDisease').and.returnValue(
        of(null)
      );
      spyOn(component.snackBar, 'error');
      component.onSubmit();
      expect(component.diseaseService.createDisease).toHaveBeenCalledWith({
        id: '123',
        name: 'Test Disease',
        description: 'Test description',
        code: '',
      } as Disease);
      expect(component.snackBar.error).toHaveBeenCalledWith(
        'Add disease failed !',
        2000
      );
    });
  });

  describe('onKeyUp', () => {
    it('should not make API call when the length of the input value is less than or equal to 4', () => {
      spyOn(component.diseaseService, 'getICDCodes');
      component.onKeyUp('1234');
      expect(component.diseaseService.getICDCodes).not.toHaveBeenCalled();
    });
    it('should make API call when the length of the input value is greater than 4', () => {
      spyOn(component.diseaseService, 'getICDCodes').and.returnValue(of());
      component.onKeyUp('12345');
      expect(component.diseaseService.getICDCodes).toHaveBeenCalledWith(
        '12345'
      );
      expect(component.icdCodes).toEqual({});
    });
  });

  describe('onSelectICD', () => {
    it('should update the form value with the selected ICD code', () => {
      const option = jasmine.createSpyObj('_MatOptionBase', ['select']);
      // const selectedEvent = new MatAutocompleteSelectedEvent(option, {
      //   value: 'A00',
      //   viewValue: 'Cholera',
      // });
      // const selectedEvent = new MatAutocompleteSelectedEvent(null, {
      //   value: 'A00',
      //   viewValue: 'Cholera',
      // });
      // component.onSelectICD(selectedEvent);
      expect(component.addDiseaseForm.value).toEqual({
        name: 'Cholera',
        id: '',
        description: 'A00-Cholera',
      });
    });
  });
});
