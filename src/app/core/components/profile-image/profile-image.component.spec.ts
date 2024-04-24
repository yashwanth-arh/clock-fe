import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileImageComponent } from './profile-image.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppModule, CustomLayoutGapStyleBuilder } from 'src/app/app.module';
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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';
import { CheckOsType } from '../../interceptors/check-os-type';
import { SettingsStateService } from '../../services/settings-state.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SidenavService } from '../../services/sidenav.service';
import { AuthStateService } from '../../services/auth-state.service';

describe('ProfileImageComponent', () => {
  let component: ProfileImageComponent;
  let fixture: ComponentFixture<ProfileImageComponent>;
  let appModule = new AppModule();
  let sidenavService: SidenavService;
  let authStateService: AuthStateService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileImageComponent],
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
        { provide: SidenavService, useValue: { profileImage: { subscribe: () => {} } } },
        { provide: AuthStateService, useValue: { userLoggedIn: { subscribe: () => {} } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sidenavService = TestBed.inject(SidenavService);
    authStateService = TestBed.inject(AuthStateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set the shapeOfImage input', () => {
    component.shapeOfImage = 'circle';
    expect(component.shapeOfImage).toEqual('circle');
  });
  it('should set the profileImage input', () => {
    const url = 'https://www.example.com/image.jpg';
    component.profileImage = url;
    expect(component.profileImage).toEqual(url);
  });
  it('should set the defaultUrl', () => {
    expect(component.defaultUrl).toEqual('assets/svg/DashboardIcons/Patient.svg');
  });
  it('should set the profile image URL when user is logged in and a profile image is available', () => {
    const profileImageUrl: SafeResourceUrl = undefined;
    spyOn(sidenavService.profileImage, 'subscribe').and.callThrough();
    spyOn(authStateService.userLoggedIn, 'subscribe').and.callFake((callback: any) => callback(true));
    component.ngOnInit();
    expect(sidenavService.profileImage.subscribe).toHaveBeenCalled();
    expect(component.profileImage).toEqual(profileImageUrl);
  });
  it('should not set the profile image URL when user is not logged in', () => {
    const profileImageUrl: SafeResourceUrl = 'https://example.com/profile-image.jpg';
    spyOn(sidenavService.profileImage, 'subscribe').and.callThrough();
    spyOn(authStateService.userLoggedIn, 'subscribe').and.callFake((callback: any) => callback(false));
    component.ngOnInit();
    expect(sidenavService.profileImage.subscribe).not.toHaveBeenCalled();
    expect(component.profileImage).toEqual(undefined);
  });

  it('should apply the shape of the image based on the input parameter', () => {
    component.shapeOfImage = 'circle';
    fixture.detectChanges();
    const imageElement: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(imageElement.style.borderRadius).toEqual('');
  });
});
