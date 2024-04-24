import { ComponentFixture, TestBed,tick,fakeAsync  } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { of,throwError  } from 'rxjs';
import { ForgotPasswordComponent } from './forgot-password.component';
import { CheckOsType } from '../core/interceptors/check-os-type';
import { AsyncPipe, CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { AppModule, CustomLayoutGapStyleBuilder } from '../app.module';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { FlexLayoutModule, CoreModule, LayoutGapStyleBuilder } from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
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
import { ForgotPasswordService } from './service/forgot-password.service';
import { AuthService } from '../core/services/auth.service';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let appModule = new AppModule();
  let authServiceSpy = jasmine.createSpyObj('AuthService', ['']);
  let forgotPasswordService: ForgotPasswordService;
  let forgotPasswordServiceSpy = jasmine.createSpyObj('ForgotPasswordService', ['forgotPassword']);
  let snackBarServiceSpy = jasmine.createSpyObj('MatSnackBar', ['open'],['Close']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
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
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    forgotPasswordService = TestBed.inject(ForgotPasswordService);
    authServiceSpy = TestBed.inject(AuthService);
    snackBarServiceSpy = TestBed.inject(SnackbarService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show error for required email', () => {
    const username = component.fields.username;
    username.setValue('');
    expect(username.hasError('required')).toBeTruthy();
  });

  it('should show error for invalid email', () => {
    const username = component.fields.username;
    username.setValue('invalid-email');
    expect(username.hasError('pattern')).toBeTruthy();
  });

  it('should call forgotPassword service method with email parameter', fakeAsync(() => {
    const email = 'test@example.com';
    spyOn(forgotPasswordService, 'forgotPassword').and.returnValue(of(true));
    component.forgotPasswordForm.get('username').setValue(email);
    component.onSubmit();
    tick();
    expect(forgotPasswordService.forgotPassword).toHaveBeenCalledWith(email);
  }));

  it('should show success message and set mailSend to true on successful submission', fakeAsync(() => {
    spyOn(snackBarServiceSpy, 'success');
    spyOn(forgotPasswordService, 'forgotPassword').and.returnValue(of(true));
    component.forgotPasswordForm.get('username').setValue('test@example.com');
    component.onSubmit();
    tick();
    expect(snackBarServiceSpy.success).toHaveBeenCalledWith('Mail sent successfully', 2000);
    expect(component.mailSend).toBeTruthy();
  }));
});
