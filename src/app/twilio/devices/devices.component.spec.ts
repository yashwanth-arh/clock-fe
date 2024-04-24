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
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime-ex';
import { ChartsModule } from 'ng2-charts';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule, CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import { MY_FORMATS } from 'src/app/CommonComponents/total-patients/total-patients.component';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from '../services/device.service';
import { StorageService } from '../services/storage.service';
import { VideoChatService } from '../services/videochat.service';
import { DevicesComponent } from './devices.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire';
import { VideoAudioSettingsService } from '../services/video-audio-settings.service';
import { Platform } from '@angular/cdk/platform';

describe('DevicesComponent', () => {
  let component: DevicesComponent;
  let fixture: ComponentFixture<DevicesComponent>;
  let platform: Platform;
  let settingsService: VideoAudioSettingsService;
  let appModule = new AppModule();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevicesComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
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
        { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesComponent);
    component = fixture.componentInstance;
    platform = TestBed.inject(Platform);
    settingsService = TestBed.inject(VideoAudioSettingsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedIndex to 0 by default', () => {
    expect(component.selectedIndex).toBe(0);
  });

  it('should call enumerate method of settingsService on init', () => {
    const enumerateSpy = spyOn(settingsService, 'enumerate');
    component.ngOnInit();
    expect(enumerateSpy).toHaveBeenCalled();
  });

  it('should set hasPermissions property based on result of hasPermissions method of settingsService', async () => {
    const hasPermissionsSpy = spyOn(
      settingsService,
      'hasPermissions'
    ).and.returnValue(Promise.resolve(true));
    await component.ngOnInit();
    expect(hasPermissionsSpy).toHaveBeenCalled();
    expect(component.hasPermissions).toBe(true);
  });

  describe('when running in browser', () => {
    beforeEach(() => {
      const fakePlatform = {
        isBrowser: true,
        BLINK: false,
        EDGE: false,
        FIREFOX: false,
        SAFARI: false,
        TRIDENT: false,
        WEBKIT: false,
        IOS: false,
      };
      Object.defineProperty(platform, 'isBrowser', {
        get: () => fakePlatform.isBrowser,
      });
    });

    it('should set selectedIndex to index of setting with engine property equal to BLINK if platform.BLINK is true', () => {
      spyOnProperty(component.platform, 'BLINK', 'get').and.returnValue(true);
      const expectedIndex = component.settings.findIndex(
        (setting) => setting.engine === 'BLINK'
      );
      component.ngOnInit();
      expect(component.selectedIndex).toBe(expectedIndex);
    });

    it('should set selectedIndex to index of setting with engine property equal to EDGE if platform.EDGE is true', () => {
      spyOnProperty(component.platform, 'EDGE', 'get').and.returnValue(true);
      const expectedIndex = component.settings.findIndex(
        (setting) => setting.engine === 'EDGE'
      );
      component.ngOnInit();
      expect(component.selectedIndex).toBe(expectedIndex);
    });

    it('should set selectedIndex to index of setting with engine property equal to FIREFOX if platform.FIREFOX is true', () => {
      spyOnProperty(platform, 'FIREFOX', 'get').and.returnValue(true);
      const expectedIndex = component.settings.findIndex(
        (setting) => setting.engine === 'FIREFOX'
      );
      component.ngOnInit();
      expect(component.selectedIndex).toBe(expectedIndex);
    });

    it('should set selectedIndex to index of setting with engine property equal to SAFARI if platform.SAFARI is true', () => {
      spyOnProperty(platform, 'SAFARI', 'get').and.returnValue(true);
      const expectedIndex = component.settings.findIndex(
        (setting) => setting.engine === 'SAFARI'
      );
      component.ngOnInit();
      expect(component.selectedIndex).toBe(expectedIndex);
    });

    it('should set selectedIndex to index of setting with engine property equal to EDGE if platform.TRIDENT is true', () => {
      spyOnProperty(platform, 'TRIDENT', 'get').and.returnValue(true);
      const expectedIndex = component.settings.findIndex(
        (setting) => setting.engine === 'EDGE'
      );
      component.ngOnInit();
      expect(component.selectedIndex).toBe(expectedIndex);
    });

    it('should set selectedIndex to index of setting with engine property equal to SAFARI if platform.WEBKIT is true', () => {
      spyOnProperty(platform, 'WEBKIT', 'get').and.returnValue(true);
      const expectedIndex = component.settings.findIndex(
        (setting) => setting.engine === 'SAFARI'
      );
      component.ngOnInit();
      expect(component.selectedIndex).toBe(expectedIndex);
    });

    it('should set selectedIndex to index of setting with engine property equal to IOS if platform.IOS is true', () => {
      spyOnProperty(platform, 'IOS', 'get').and.returnValue(true);
      const expectedIndex = component.settings.findIndex(
        (setting) => setting.engine === 'IOS'
      );
      component.ngOnInit();
      expect(component.selectedIndex).toBe(expectedIndex);
    });
  });

  describe('when running outside browser', () => {
    beforeEach(() => {
      spyOnProperty(component.platform, 'isBrowser').and.returnValue(false);
    });

    it('should not set selectedIndex', () => {
      component.ngOnInit();
      expect(component.selectedIndex).toBe(0);
    });
  });

  it('should emit closeDialog event when close method is called', () => {
    spyOn(component.closeDialog, 'emit');
    component.close();
    expect(component.closeDialog.emit).toHaveBeenCalled();
  });
});
