import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { UserSupportComponent } from './user-support.component';
import { RouterModule } from '@angular/router';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
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
import { TicketService } from 'src/app/ticket/ticket.service';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';

describe('UserSupportComponent', () => {
  let component: UserSupportComponent;
  let fixture: ComponentFixture<UserSupportComponent>;
  let ticketservice: TicketService;
  let dashboardService: CaregiverDashboardService;
  let appModule = new AppModule();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSupportComponent],
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
    fixture = TestBed.createComponent(UserSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSupportTickets on init', () => {
    spyOn(component, 'getSupportTickets');
    component.ngOnInit();
    expect(component.getSupportTickets).toHaveBeenCalled();
  });

  it('should call getAllTitles on init', () => {
    spyOn(component, 'getAllTitles');
    component.ngOnInit();
    expect(component.getAllTitles).toHaveBeenCalled();
  });

  it('should set ticketDescription validator when ticketSummary is Others', () => {
    component.ngOnInit();
    const ticketSummary = component.ticketForm.get('ticketSummary');
    ticketSummary.setValue('Others');
    expect(
      component.ticketForm.get('ticketDescription').validator
    ).toBeTruthy();
  });

  it('should not set ticketDescription validator when ticketSummary is not Others', () => {
    component.ngOnInit();
    const ticketSummary = component.ticketForm.get('ticketSummary');
    ticketSummary.setValue('Bug');
    expect(component.ticketForm.get('ticketDescription').validator).toBeFalsy();
  });

  it('should call getTicketDetails when removeSelectedFile is called with a ticket ID', () => {
    spyOn(component, 'getTicketDetails');
    const image = { id: '123' };
    component.ticketId = '456';
    component.removeSelectedFile(0, image, 'image');
    expect(component.getTicketDetails).toHaveBeenCalled();
  });

  it('should not call getTicketDetails when removeSelectedFile is called without a ticket ID', () => {
    spyOn(component, 'getTicketDetails');
    const image = { id: '123' };
    component.ticketId = null;
    component.removeSelectedFile(0, image, 'image');
    expect(component.getTicketDetails).not.toHaveBeenCalled();
  });
});
