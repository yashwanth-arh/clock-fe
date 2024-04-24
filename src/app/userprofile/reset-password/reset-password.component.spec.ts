import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ResetPasswordComponent } from './reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule, By } from '@angular/platform-browser';
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
import { AuthService } from 'src/app/core/services/auth.service';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { of } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authService: AuthService;
  let caregiverDashboardService: CaregiverDashboardService;
  let snackbarService: SnackbarService;
  let appModule = new AppModule();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
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
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    caregiverDashboardService = TestBed.inject(CaregiverDashboardService);
    snackbarService = TestBed.inject(SnackbarService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.resetForm).toBeDefined();
    expect(component.resetForm.get('newPassword')).toBeDefined();
    expect(component.resetForm.get('reNewPassword')).toBeDefined();
    expect(component.resetForm.get('existingPassword')).toBeDefined();
  });

  it('should set submitted to true on form submission', () => {
    const submitBtn = fixture.debugElement.query(
      By.css('button[type=submit]')
    ).nativeElement;
    submitBtn.click();
    expect(component.submitted).toBeTruthy();
  });

  it('should show error message if the new password is same as old password', () => {
    const snackbarServiceSpy = spyOn(snackbarService, 'error');
    component.resetForm.patchValue({
      newPassword: 'oldPassword',
      reNewPassword: 'oldPassword',
      existingPassword: 'oldPassword',
    });
    const submitBtn = fixture.debugElement.query(
      By.css('button[type=submit]')
    ).nativeElement;
    submitBtn.click();
    expect(snackbarServiceSpy).toHaveBeenCalledWith('Enter valid details');
  });

  it('should show error message if the new password and retype password do not match', () => {
    const snackbarServiceSpy = spyOn(snackbarService, 'error');
    component.resetForm.patchValue({
      newPassword: 'newPassword',
      reNewPassword: 'reTypePassword',
      existingPassword: 'oldPassword',
    });
    const submitBtn = fixture.debugElement.query(
      By.css('button[type=submit]')
    ).nativeElement;
    submitBtn.click();
    expect(snackbarServiceSpy).toHaveBeenCalledWith('Enter valid details');
  });

  it('should not call the service if the form is invalid', () => {
    spyOn(caregiverDashboardService, 'resetPassword');
    const submitBtn = fixture.debugElement.query(
      By.css('button[type=submit]')
    ).nativeElement;
    submitBtn.click();
    expect(caregiverDashboardService.resetPassword).toHaveBeenCalledTimes(0);
  });

  it('should not call the service if the form is invalid', () => {
    const snackbarServiceSpy = spyOn(snackbarService, 'error');
    const submitBtn = fixture.debugElement.query(
      By.css('button[type=submit]')
    ).nativeElement;
    submitBtn.click();
    expect(snackbarServiceSpy).toHaveBeenCalledWith('Enter valid details');
  });

  it('should not call the service if the form has invalid regex', () => {
    const snackbarServiceSpy = spyOn(snackbarService, 'error');
    component.resetForm.patchValue({
      newPassword: 'invalidPassword',
      reNewPassword: 'invalidPassword',
      existingPassword: 'invalidPassword',
    });
    const submitBtn = fixture.debugElement.query(
      By.css('button[type=submit]')
    ).nativeElement;
    submitBtn.click();
    expect(snackbarServiceSpy).toHaveBeenCalledWith('Enter valid details');
  });

  it('should call the service if the form is valid', () => {
    spyOn(caregiverDashboardService, 'resetPassword').and.returnValue(of({}));
    component.resetForm.patchValue({
      newPassword: 'validPassword',
      reNewPassword: 'validPassword',
      existingPassword: 'oldPassword',
    });
    const submitBtn = fixture.debugElement.query(
      By.css('button[type=submit]')
    ).nativeElement;
    submitBtn.click();
    expect(caregiverDashboardService.resetPassword).toHaveBeenCalled();
  });
});
