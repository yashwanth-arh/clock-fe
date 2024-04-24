import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTicketComponent } from './support-ticket.component';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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
import { of } from 'rxjs';
describe('SupportTicketComponent', () => {
  let component: SupportTicketComponent;
  let fixture: ComponentFixture<SupportTicketComponent>;
  let appModule = new AppModule();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportTicketComponent],
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
    fixture = TestBed.createComponent(SupportTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize status filter to "ASSIGNED" and get support tickets', () => {
    spyOn(component, 'getSupportTicket');
    component.ngOnInit();
    expect(component.statusFilter).toBe('ASSIGNED');
    expect(component.getSupportTicket).toHaveBeenCalledWith('ASSIGNED');
  });

  it('should call searchSupportTickets method with correct parameters when searchValue is longer than 2 characters', () => {
    spyOn(component.hospitalService, 'searchStatus').and.returnValue(
      of({ content: [] })
    );
    component.searchValue = 'test';
    component.searchSupportTickets(0, 10);
    expect(component.hospitalService.searchStatus).toHaveBeenCalledWith(
      'test',
      0,
      10
    );
  });

  it('should reset searchGroup and call getSupportTicket method with "INITIATED" status filter when searchValue is empty', () => {
    spyOn(component, 'getSupportTicket');
    component.searchValue = '';
    component.isEnableGlobalSearch = true;
    component.showTabBoolean = false;
    component.unselectGlobalSearch();
    expect(component.searchGroup.value.searchSupport).toBe(null);
    expect(component.getSupportTicket).toHaveBeenCalledWith('INITIATED');
    expect(component.isEnableGlobalSearch).toBe(false);
    expect(component.showTabBoolean).toBe(true);
  });

  it('should call searchSupportTickets method when handlePageEvent is triggered and searchValue is not empty', () => {
    spyOn(component, 'searchSupportTickets');
    component.searchValue = 'test';
    component.handlePageEvent({ length: 100, pageIndex: 0, pageSize: 10 });
    expect(component.searchSupportTickets).toHaveBeenCalledWith(0, 10);
  });

  it('should call getSupportTicketsp method when handlePageEvent is triggered and searchValue is empty', () => {
    spyOn(component.hospitalService, 'getSupportTicketsp').and.returnValue(
      of({ content: [] })
    );
    component.searchValue = '';
    component.handlePageEvent({ length: 100, pageIndex: 0, pageSize: 10 });
    expect(
      component.hospitalService.getSupportTicketsp
    ).toHaveBeenCalledWith('ASSIGNED', 0, 10);
  });
});
