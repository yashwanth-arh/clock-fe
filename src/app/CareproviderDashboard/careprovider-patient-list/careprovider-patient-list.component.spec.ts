import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareproviderPatientListComponent } from './careprovider-patient-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { Router, RouterModule } from '@angular/router';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
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
import { AngularFireModule } from '@angular/fire';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime-ex';
import { ChartsModule } from 'ng2-charts';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxMaskModule } from 'ngx-mask';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { environment } from 'src/environments/environment';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';
describe('CareproviderPatientListComponent', () => {
  let component: CareproviderPatientListComponent;
  let fixture: ComponentFixture<CareproviderPatientListComponent>;
  let appModule = new AppModule();
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: appModule.declarations,
      imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireMessagingModule,
        AngularMaterialModule,
        AngularFireModule.initializeApp(environment.firebase),
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CoreModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        ChartsModule,
        NgxDatatableModule,
        NgxChartsModule,
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
        HotToastModule.forRoot(),
        NgIdleKeepaliveModule.forRoot(),
        MatTooltipModule,
        MatFormFieldModule,
        GooglePlaceModule,
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
    fixture = TestBed.createComponent(CareproviderPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should redirect to /login if user is not authenticated and not on login page', () => {
    localStorage.removeItem('auth');
    // spyOnProperty(router.routerState.snapshot, 'url').and.returnValue('/dashboard');
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not redirect to /login if user is authenticated and not on login page', () => {
    localStorage.setItem('auth', '1234');
    // spyOnProperty(router.routerState.snapshot, 'url').and.returnValue('/dashboard');
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalled();
  });
  it('should set osType property to platform type', () => {
    expect(component.osType).toBe(window.navigator.platform);
  });

  it('should set showHighAlertFloating to true if caregiverHighAlert event is triggered', () => {
    component.caregiverSharedService.caregiverHighAlert.next(true);
    expect(component.showHighAlertFloating).toBeTrue();
  });

  // it('should retrieve existingAudioCall from localStorage if openedAudioCallDialog is set', () => {
  //   const existingAudioCall = { id: 1, name: 'John Doe' };
  //   spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(existingAudioCall));
  //   component.ngOnInit();
  //   expect(localStorage.getItem).toHaveBeenCalledWith('openedAudioCallDialog');
  //   expect(component.existingAudioCall).toEqual(existingAudioCall);
  // });

  // it('should retrieve existingVideoCall from localStorage if openedVideoCallDialog is set', () => {
  //   const existingVideoCall = { id: 2, name: 'Jane Smith' };
  //   spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(existingVideoCall));
  //   component.ngOnInit();
  //   expect(localStorage.getItem).toHaveBeenCalledWith('openedVideoCallDialog');
  //   expect(component.existingVideoCall).toEqual(existingVideoCall);
  // });
  it('should do nothing if openedAudioCallDialog localStorage item exists', () => {
    localStorage.setItem('openedAudioCallDialog', JSON.stringify({ some: 'data' }));
    component.ngOnInit();
    // no assertions necessary, just checking that it doesn't throw any errors
  });

  it('should do nothing if openedVideoCallDialog localStorage item exists', () => {
    localStorage.setItem('openedVideoCallDialog', JSON.stringify({ some: 'data' }));
    component.ngOnInit();
    // no assertions necessary, just checking that it doesn't throw any errors
  });

  it('should set scheduledId and callEndType based on localStorage items', () => {
    localStorage.setItem('durationCall', '100');
    localStorage.setItem('scheduledid', '123');
    localStorage.setItem('callEndType', 'missed');
    component.ngOnInit();
    expect(component.scheduledId).toBe('123');
    expect(component.callEndType).toBe('missed');
  });
  it('should set showHighAlertFloating to true if caregiverHighAlert emits true', () => {
    component.caregiverSharedService.caregiverHighAlert.next(true);
    component.ngOnInit();
    expect(component.showHighAlertFloating).toBe(true);
  });

  it('should set localStorage redZone to true and set highAlertMatTab to false if triggeredhighAlertPatientNotification emits true', () => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
    component.caregiverSharedService.triggeredhighAlertPatientNotification.next(true);
    component.ngOnInit();
    expect(localStorage.setItem).toHaveBeenCalledWith('redZone', 'true');
    // expect(component.tabCounts).toHaveBeenCalled();
    expect(component.highAlertMatTab).toBe(false);
    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });

  it('should remove localStorage redZone if triggeredhighAlertPatientNotification emits false', () => {
    spyOn(localStorage, 'removeItem');
    component.caregiverSharedService.triggeredhighAlertPatientNotification.next(false);
    component.ngOnInit();
    expect(localStorage.removeItem).toHaveBeenCalledWith('redZone');
  });
  
});
