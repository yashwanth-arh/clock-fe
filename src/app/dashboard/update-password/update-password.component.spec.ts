import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { UpdatePasswordComponent } from './update-password.component';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
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
import { CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';
import { PatientActivationService } from 'src/app/patient-account-activation/patient-activation.service';
import { throwError, of } from 'rxjs';

describe('UpdatePasswordComponent', () => {
  let component: UpdatePasswordComponent;
  let fixture: ComponentFixture<UpdatePasswordComponent>;
  let activationService: PatientActivationService;
  let snackbarService: SnackbarService;
  let authServiceSpy = jasmine.createSpyObj(
    'validateHospitalForm',
    ['user']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatePasswordComponent],
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
    fixture = TestBed.createComponent(UpdatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    activationService = TestBed.inject(PatientActivationService);
    snackbarService = TestBed.inject(SnackbarService);
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set up the form and call getTokenValidation', () => {
    // spyOn(component, 'validateHospitalForm');
    spyOn(component, 'getTokenValidation');
    component.ngOnInit();
    // expect(component.validateHospitalForm).toHaveBeenCalled();
    expect(component.getTokenValidation).toHaveBeenCalled();
  });
  it('should initialize updateForm', () => {
    expect(component.updateForm).toBeDefined();
  });

  it('should validate updateForm', () => {
    expect(component.updateForm.valid).toBeFalsy();
    component.updateForm.controls['password'].setValue('test1234');
    component.updateForm.controls['repassword'].setValue('test1234');
    expect(component.updateForm.valid).toBeTruthy();
  });
  it('should toggle password visibility', () => {
    expect(component.newFieldTextType).toBeFalsy();
    component.toggleFieldTextType('new');
    expect(component.newFieldTextType).toBeTruthy();
    component.toggleFieldTextType('new');
    expect(component.newFieldTextType).toBeFalsy();
  });
  it('should call tokenValidation on init', () => {
    spyOn(activationService, 'tokenValidation').and.callThrough();
    component.ngOnInit();
    expect(activationService.tokenValidation).toHaveBeenCalled();
  });
  it('should show error if token is invalid', () => {
    spyOn(activationService, 'tokenValidation').and.returnValue(
      throwError({ error: { message: 'Invalid token' } })
    );
    spyOn(snackbarService, 'error');
    component.getTokenValidation();
    expect(snackbarService.error).toHaveBeenCalledWith(
      'Reset password link has expired'
    );
  });
  it('should show success if token is valid', () => {
    spyOn(activationService, 'tokenValidation').and.returnValue(
      of({ message: 'Token validated' })
    );
    spyOn(snackbarService, 'success');
    component.getTokenValidation();
    expect(snackbarService.success).toHaveBeenCalledWith('Token validated');
  });


  // it('should create the updateForm with password and repassword fields', () => {
  //   // Act
  //   component.validateHospitalForm();
  
  //   // Assert
  //   expect(component.updateForm.contains('password')).toBe(true);
  //   expect(component.updateForm.contains('repassword')).toBe(true);
  // });
  // it('should call updatePassword method of forgotService and navigate to login page when form is valid and passwords match', () => {
  //   // Arrange
  //   spyOn(forgotService, 'updatePassword').and.returnValue(of({}));
  //   spyOn(router, 'navigate');
  //   component.updateForm.setValue({password: 'password123', repassword: 'password123'});
  //   const value = component.updateForm.value;
  
  //   // Act
  //   component.onSubmit(value, true);
  
  //   // Assert
  //   expect(forgotService.updatePassword).toHaveBeenCalledWith(value, component.token);
  //   expect(snackbarService.success).toHaveBeenCalledWith('Password updated successfully');
  //   expect(router.navigate).toHaveBeenCalledWith(['/login']);
  // });

  it('should call error method of snackbarService when form is valid but passwords do not match', () => {
    spyOn(snackbarService, 'error');
    component.updateForm.setValue({password: 'password123', repassword: 'password456'});
    const value = component.updateForm.value;
    component.onSubmit(value, true);
    expect(snackbarService.error).toHaveBeenCalledWith('Enter valid data');
  });
  it('should call error method of snackbarService when form is invalid', () => {
    spyOn(snackbarService, 'error');
    component.updateForm.setValue({password: '', repassword: ''});
    const value = component.updateForm.value;
    component.onSubmit(value, false);
    expect(snackbarService.error).toHaveBeenCalledWith('Enter valid data');
  });
  // it('should call success method of snackbarService when token is validated', () => {
  //   // Arrange
  //   spyOn(snackbarService, 'success');
  //   spyOn(activationService, 'tokenValidation').and.returnValue(of({}));

  //   // Act
  //   component.getTokenValidation();

  //   // Assert
  //   expect(snackbarService.success).toHaveBeenCalledWith('Token validated');
  // });
});

