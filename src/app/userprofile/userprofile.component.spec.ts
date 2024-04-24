import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserprofileComponent } from './userprofile.component';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CheckOsType } from '../core/interceptors/check-os-type';
import { RouterModule } from '@angular/router';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppModule, CustomLayoutGapStyleBuilder } from '../app.module';
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
import { AuthService } from '../core/services/auth.service';
import { LocationService } from '../core/services/location.service';
import { UserProfileService } from './service/user-profile.service';
import { of } from 'rxjs';
import { User } from '../shared/models/user.model';
describe('UserprofileComponent', () => {
  let component: UserprofileComponent;
  let fixture: ComponentFixture<UserprofileComponent>;
  let appModule = new AppModule();
  let authService: AuthService;
  let locationService: LocationService;
  let userService: UserProfileService;
  let userProfileService: UserProfileService;
  let snackBarService: SnackbarService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserprofileComponent],
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
    fixture = TestBed.createComponent(UserprofileComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    locationService = TestBed.inject(LocationService);
    userService = TestBed.inject(UserProfileService);
    userProfileService = TestBed.inject(UserProfileService);
    snackBarService = TestBed.inject(SnackbarService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should set selectedRole and username properties in ngOnInit', () => {
  //   const user: User = { userDetails: { userRole: 'ADMIN', username: 'testuser' } };
  //   spyOn(authService.user, 'subscribe').and.returnValue(of(user));

  //   component.ngOnInit();

  //   expect(component.selectedRole).toBe('ADMIN');
  //   expect(component.username).toBe('testuser');
  // });

  it('should set state property in ngOnInit', () => {
    const jsonData = { CA: [], NY: [] };
    spyOn(locationService, 'getJSONData').and.returnValue(of(jsonData));

    component.ngOnInit();

    expect(component.state).toEqual(['CA', 'NY']);
  });

  it('should unsubscribe in ngOnDestroy', () => {
    spyOn(component.destroyed, 'next');
    spyOn(component.destroyed, 'complete');

    component.ngOnDestroy();

    expect(component.destroyed.next).toHaveBeenCalled();
    expect(component.destroyed.complete).toHaveBeenCalled();
  });

  it('should toggle editMode property', () => {
    expect(component.editMode).toBeFalse();

    const result = component.toggleEditMode();

    expect(result).toBeTrue();
    expect(component.editMode).toBeTrue();

    const result2 = component.toggleEditMode();

    expect(result2).toBeFalse();
    expect(component.editMode).toBeFalse();
  });

  it('should return confirmPassowrd form control', () => {
    expect(component.confirmPassowrd instanceof FormControl).toBeTrue();
  });

  // it('should return error message for emailId form control', () => {
  //   const profile = component.profile;
  //   profile.get('emailId').setValue('');

  //   expect(component.getErrorEmail()).toBe('Email Id is required');

  //   profile.get('emailId').setValue('invalid-email');

  //   expect(component.getErrorEmail()).toBe('Not a valid emailaddress');

  //   spyOn(userProfileService, 'isEmailAlreadyInUse').and.returnValue(of(true));
  //   profile.get('emailId').setValue('testuser@example.com');

  //   expect(component.getErrorEmail()).toBe(
  //     'This emailaddress is already in use'
  //   );
  // });

  it('should return error message for homeNumber form control', () => {
    const profile = component.profile;
    profile.get('homeNumber').setValue('');

    expect(component.getErrorHomeNo()).toBe('Home number is required');

    profile.get('homeNumber').setValue('1234');

    expect(component.getErrorHomeNo()).toBe(
      'Please, Enter 10 digit Home Number'
    );
  });

  it('should return error message for cellNumber form control', () => {
    const profile = component.profile;
    profile.get('cellNumber').setValue('');

    expect(component.getErrorCellNo()).toBe('Cell number is required');
    profile.get('cellNumber').setValue('1234');

    expect(component.getErrorCellNo()).toBe(
      'Please, Enter 10 digit Cell Number'
    );
  });

  // it('should save user profile data', () => {
  //   const user: User = {
  //     userDetails: { id: 1, userRole: 'ADMIN', username: 'testuser' },
  //   };
  //   spyOn(authService.user, 'subscribe').and.returnValue(of(user));
  //   const saveSpy = spyOn(
  //     userProfileService,
  //     'saveUserProfile'
  //   ).and.returnValue(of(true));
  //   const snackBarSpy = spyOn(snackBarService, 'openSnackBar');

  //   component.saveUserProfile();

  //   expect(saveSpy).toHaveBeenCalled();
  //   expect(snackBarSpy).toHaveBeenCalledWith('User profile saved successfully');
  // });

  // it('should handle saveUserProfile error', () => {
  //   const user: User = {
  //     userDetails: { id: 4, userRole: 'DOCTOR', username: 'testuser' },
  //   };
  //   spyOn(authService.user, 'subscribe').and.returnValue(of(user));
  //   const saveSpy = spyOn(
  //     userProfileService,
  //     'saveUserProfile'
  //   ).and.returnValue(throwError('error'));
  //   const snackBarSpy = spyOn(snackBarService, 'openSnackBar');

  //   component.saveUserProfile();

  //   expect(saveSpy).toHaveBeenCalled();
  //   expect(snackBarSpy).toHaveBeenCalledWith('Error saving user profile');
  // });
});
