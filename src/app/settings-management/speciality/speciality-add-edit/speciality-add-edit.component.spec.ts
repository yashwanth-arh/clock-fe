import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SpecialityAddEditComponent } from './speciality-add-edit.component';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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
import { SpecialityService } from '../../services/speciality.service';
import { of, throwError } from 'rxjs';

describe('SpecialityAddEditComponent', () => {
  let component: SpecialityAddEditComponent;
  let fixture: ComponentFixture<SpecialityAddEditComponent>;
  let specialityServiceSpy: jasmine.SpyObj<SpecialityService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let dialogSpy: jasmine.SpyObj<MatDialogRef<SpecialityAddEditComponent>>;
  let appModule = new AppModule();

  beforeEach(async () => {
    specialityServiceSpy = jasmine.createSpyObj('SpecialityService', [
      'addSpecialty',
      'editSpecialty',
    ]);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', [
      'success',
      'error',
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      declarations: [SpecialityAddEditComponent],
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
    fixture = TestBed.createComponent(SpecialityAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initializeSpecialtyAddEditForm', () => {
    it('should create a form with specialtyname control', () => {
      component.initializeSpecialtyAddEditForm();
      expect(component.specialtyForm.contains('specialtyname')).toBeTrue();
    });

    it('should set the value of specialtyname control to the passed data', () => {
      const data = { value: { name: 'Cardiology' } };
      component.data = data;
      component.initializeSpecialtyAddEditForm();
      expect(component.specialtyForm.get('specialtyname').value).toEqual(
        'Cardiology'
      );
    });
  });

  describe('submitSpecialty', () => {
    it('should call createSpecialty if add is "add"', () => {
      component.data.add === 'add';
      spyOn(component, 'createSpecialty');
      component.submitSpecialty();
      expect(component.createSpecialty).toHaveBeenCalled();
    });

    it('should call updateSpecialty if add is not "add"', () => {
      component.data.add = 'edit';
      spyOn(component, 'updateSpecialty');
      component.submitSpecialty();
      expect(component.updateSpecialty).toHaveBeenCalled();
    });

    it('should not call createSpecialty or updateSpecialty if the form is invalid', () => {
      component.specialtyForm.setErrors({ invalid: true });
      spyOn(component, 'createSpecialty');
      spyOn(component, 'updateSpecialty');
      component.submitSpecialty();
      expect(component.createSpecialty).not.toHaveBeenCalled();
      expect(component.updateSpecialty).not.toHaveBeenCalled();
    });
  });

  describe('createSpecialty', () => {
    it('should call the addSpecialty method of the specialtyservice', () => {
      const body = { name: 'Cardiology' };
      specialityServiceSpy.addSpecialty.and.returnValue(of({}));
      component.createSpecialty(body);
      expect(specialityServiceSpy.addSpecialty).toHaveBeenCalledWith(body);
    });

    it('should show a success snackbar message and close the dialog when addSpecialty is successful', () => {
      const body = { name: 'Cardiology' };
      specialityServiceSpy.addSpecialty.and.returnValue(of({}));
      component.createSpecialty(body);
      expect(snackbarServiceSpy.success).toHaveBeenCalled();
      expect(dialogSpy.close).toHaveBeenCalled();
    });
    it('should show an error snackbar message when addSpecialty fails', () => {
      const body = { name: 'Cardiology' };
      specialityServiceSpy.addSpecialty.and.returnValue(
        throwError({ error: 'Failed to add specialty' })
      );
      component.createSpecialty(body);
      expect(snackbarServiceSpy.error).toHaveBeenCalled();
    });
  });

  describe('updateSpecialty', () => {
    it('should call the editSpecialty method of the specialtyservice', () => {
      const body = { name: 'Cardiology' };
      const specialtyId = '123';
      component.specialtyId = specialtyId;
      specialityServiceSpy.editSpecialty.and.returnValue(of({}));
      component.updateSpecialty(body);
      expect(specialityServiceSpy.editSpecialty).toHaveBeenCalledWith(
        specialtyId,
        body
      );
    });
    it('should show a success snackbar message and close the dialog when editSpecialty is successful', () => {
      const body = { name: 'Cardiology' };
      specialityServiceSpy.editSpecialty.and.returnValue(of({}));
      component.updateSpecialty(body);
      expect(snackbarServiceSpy.success).toHaveBeenCalled();
      expect(dialogSpy.close).toHaveBeenCalled();
    });

    it('should show an error snackbar message when editSpecialty fails', () => {
      const body = { name: 'Cardiology' };
      specialityServiceSpy.editSpecialty.and.returnValue(
        throwError({ error: 'Failed to edit specialty' })
      );
      component.updateSpecialty(body);
      expect(snackbarServiceSpy.error).toHaveBeenCalled();
    });
  });
});
