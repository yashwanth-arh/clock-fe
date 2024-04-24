import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CaregiverdashboardComponent } from './caregiverdashboard.component';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
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
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { CaregiverDashboardService } from '../caregiver-dashboard.service';
// import { NotifierQueueService } from 'angular-notifier/lib/services/notifier-queue.service';
import { of,throwError } from 'rxjs';

describe('CaregiverdashboardComponent', () => {
  let component: CaregiverdashboardComponent;
  let fixture: ComponentFixture<CaregiverdashboardComponent>;
  let appModule = new AppModule();
  let snackbarServiceStub;
  let serviceStub;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaregiverdashboardComponent],
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
        NotifierService,
        // NotifierQueueService,
        StorageService,
        PushNotificationService,
        SettingsStateService,
        NotifierService,
        // NotifierQueueService,
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
        { provide: SnackbarService, useValue: snackbarServiceStub },
        { provide: CaregiverDashboardService, useValue: serviceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaregiverdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    snackbarServiceStub = {
      error: () => {}
    };
    serviceStub = {
      getNotificationCount: () => of({ count: 2 })
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set roleid, userRole, and username in constructor', () => {
    expect(component.roleid).toBe(undefined);
    expect(component.userRole).toBe(undefined);
    expect(component.username).toBeDefined();
  });
  it('should set triggeredNotification to true when triggeredNotificationCount is true', () => {
    component.ngOnInit();
    expect(component.triggeredNotification).toBe(false);
  });

  it('should retrieve notification count successfully', () => {
    const serviceSpy = spyOn(component.service, 'getNotificationCount').and.returnValue(of({count: '5'}));
    component.notificationCount();
    expect(serviceSpy).toHaveBeenCalled();
    expect(component.countNotification).toEqual('5');
  });
  it('should redirect to login page when user is unauthorized', () => {
    const serviceSpy = spyOn(component.service, 'getNotificationCount').and.returnValue(throwError({status: 401}));
    const routerSpy = spyOn(component.router, 'navigate');
    component.notificationCount();
    expect(serviceSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });
  it('should trigger notification count when triggeredNotificationCount changes', () => {
    component.triggeredNotification = true;
    const notificationCountSpy = spyOn(component, 'notificationCount');
    component.ngOnInit();
    expect(notificationCountSpy).toHaveBeenCalled();
  });
  it('should call notificationCount when triggeredNotification is true', () => {
    spyOn(component, 'notificationCount');
    component.triggeredNotification = true;
    component.ngOnInit();
    expect(component.notificationCount).toHaveBeenCalled();
  });
  // it('should not call notificationCount when triggeredNotification is false', () => {
  //   spyOn(component, 'notificationCount');
  //   component.triggeredNotification = false;
  //   component.ngOnInit();
  //   expect(component.notificationCount).not.toHaveBeenCalled();
  // });
  it('should call notificationCount when passed a truthy value', () => {
    spyOn(component, 'notificationCount');
    component.getUpdatedCount(true);
     component.ngOnInit();
    expect(component.notificationCount).toHaveBeenCalled();
  });
  it('should not call notificationCount when passed a falsy value', () => {
    spyOn(component, 'notificationCount');
    component.getUpdatedCount(false);
    expect(component.notificationCount).not.toHaveBeenCalled();
  });
});
