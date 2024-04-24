import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CallSchedulerComponent } from './call-scheduler.component';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { environment } from 'src/environments/environment';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire';
import { NotifierModule, NotifierService } from 'angular-notifier';
// import { NotifierQueueService } from 'angular-notifier/lib/services/notifier-queue.service';

describe('CallSchedulerComponent', () => {
  let component: CallSchedulerComponent;
  let fixture: ComponentFixture<CallSchedulerComponent>;
  let appModule = new AppModule();
  let checkbox: HTMLInputElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: appModule.declarations,
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
        NotifierModule,
        // NotifierService,

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
        NotifierService,
        DatePipe,
        DecimalPipe,
        DeviceService,
        VideoChatService,
        StorageService,
        NotifierService,
        // NotifierQueueService,
        PushNotificationService,
        SettingsStateService,
        AsyncPipe,
        WeightPipe,
        SnackbarService,
        NotifierService,
        // NotifierQueueService,
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
    fixture = TestBed.createComponent(CallSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('should set loadRes to true when scheduleCall() is called', () => {
  //   component.scheduleCall();
  //   expect(component.loadRes).toBeTrue();
  // });
  it('should update checkedUser value when event is triggered', () => {
    // const component = new CallSchedulerComponent();
    const evt = { checked: true };
    component.checkValue(evt);
    expect(component.checkedUser).toEqual(true);
  });
  it('should update checkedUser value when event is triggered', () => {
    // const component = new CallSchedulerComponent();
    const evt = { checked: false };
    component.checkValue(evt);
    expect(component.checkedUser).toEqual(false);
  });
  it('should set maxDate correctly', () => {
    const coeff = 1000 * 60 * 5;
    const date = new Date();
    const expectedDate = new Date(Math.round(date.getTime() / coeff) * coeff);
    expect(component.maxDate).toEqual(expectedDate);
  });
  it('should set callType to SCHEDULE_VOICECALL when uniqueKey is scheduleVoice', () => {
    component.data.uniqueKey = 'scheduleVoice';
    component.ngOnInit();
    expect(component.callType).toEqual('SCHEDULE_VOICECALL');
  });
  it('should set callType to SCHEDULE_VIDEOCALL when uniqueKey is not scheduleVoice', () => {
    component.data.uniqueKey = 'scheduleVideo';
    component.ngOnInit();
    expect(component.callType).toEqual('SCHEDULE_VIDEOCALL');
  });

  it('should create scheduleCallForm with scheduleDate field as required', () => {
    component.ngOnInit();
    expect(component.scheduleCallForm).toBeDefined();
    expect(component.scheduleCallForm.controls.scheduleDate).toBeDefined();
    expect(component.scheduleCallForm.controls.scheduleDate.valid).toBeFalsy();
    component.scheduleCallForm.controls.scheduleDate.setValue('2023-03-17T12:00:00');
    expect(component.scheduleCallForm.controls.scheduleDate.valid).toBeTruthy();
  });

  it('should create scheduledCallComponent with dependencies', () => {
    expect(component.scheduledCallComponent).toBeDefined();
  });
  // it('should not update checkedUser value when event is undefined', () => {
  //   // const component = new YourComponent();
  //   const evt = undefined;
  //   component.checkValue(evt);
  //   expect(component.checkedUser).toBeUndefined();
  // });
});
