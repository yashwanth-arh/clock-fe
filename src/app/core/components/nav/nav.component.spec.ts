import { LayoutModule } from '@angular/cdk/layout';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NavComponent } from './nav.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CheckOsType } from '../../interceptors/check-os-type';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime-ex';
import { ChartsModule } from 'ng2-charts';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';
import { SettingsStateService } from '../../services/settings-state.service';
import { SnackbarService } from '../../services/snackbar.service';
import { AuthService } from '../../services/auth.service';
import { SidenavService } from '../../services/sidenav.service';
import { of } from 'rxjs';
import { ConnectionService } from '../../services/connection.service';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let appModule = new AppModule();
  let authServiceSpy = jasmine.createSpyObj(
    'AuthService',
    ['user']
  );
  let sidenavService: SidenavService;
  let connectionServiceSpy: jasmine.SpyObj<ConnectionService>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NavComponent],
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
        AuthService,
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sidenavService = TestBed.inject(SidenavService);
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
  it('should have navigationRoutes defined', () => {
    expect(component.navigationRoutes).toBeDefined();
  });
  // it('should set userRole when AuthService user observable emits', () => {
  //   const userRole = 'TEST_USER_ROLE';
  //   const userDetails = { userRole };
  //   const user = { userDetails };
  //   spyOn(authServiceSpy, 'user').and.returnValue({ subscribe: (fn: any) => fn(user) });

  //   expect(component.userRole).toBe(userRole);
  // });
  // it('should set expanded to true when AuthService user observable emits with userRole === UserRoles.DOCTOR', () => {
  //   const userDetails = { userRole: 'DOCTOR' };
  //   const user = { userDetails };
  //   spyOn(authServiceSpy, 'user').and.returnValue({ subscribe: (fn: any) => fn(user) });

  //   expect(component.expanded).toBeTrue();
  // });

  // it('should set expanded to false when AuthService user observable emits with userRole !== UserRoles.DOCTOR', () => {
  //   const userDetails = { userRole: 'PATIENT' };
  //   const user = { userDetails };
  //   spyOn(authServiceSpy, 'user').and.returnValue({ subscribe: (fn: any) => fn(user) });

  //   expect(component.expanded).toBeFalse();
  // });
  // it('should set profileImagePath when SidenavService profileImage observable emits', () => {
  //   const profileImagePath = 'TEST_PROFILE_IMAGE_PATH';
  //   spyOn(sidenavService, 'profileImage').and.returnValue({ subscribe: (fn: any) => fn(profileImagePath) });

  //   expect(component.profileImagePath).toBe(profileImagePath);
  // });
    it('should set isOnline to true when the connection is available', () => {
    fixture.detectChanges();
    expect(component.isOnline).toBe(true);
  });
  it('should set isOnline to true when connectionMonitor emits true', () => {
    connectionServiceSpy?.connectionMonitor.and.returnValue(of(true));
    component.ngOnInit();
    expect(component.isOnline).toBe(true);
  });
  // it('should set isOnline to false and call showOfflineDialog when connectionMonitor emits false', () => {
  //   connectionServiceSpy?.connectionMonitor.and.returnValue(of(false));
  //   spyOn(component, 'showOfflineDialog');
  //   component.ngOnInit();
  //   expect(component.isOnline).toBe(false);
  //   expect(component.showOfflineDialog).toHaveBeenCalled();
  // });
  it('should not set selectedRole or username when user emits null', () => {
    authServiceSpy.user.and.returnValue(of(null));
    component.ngOnInit();
    expect(component.selectedRole).toBeUndefined();
    expect(component.username).toBeUndefined();
  });
  
});
