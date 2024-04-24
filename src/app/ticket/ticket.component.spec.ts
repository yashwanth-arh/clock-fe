import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { TicketComponent } from './ticket.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { AngularMaterialModule } from '../angular-material.module';
import { AppRoutingModule } from '../app-routing.module';
import { SettingsStateService } from '../core/services/settings-state.service';
import { SnackbarService } from '../core/services/snackbar.service';
import { PushNotificationService } from '../Firebase Service/push-notification.service';
import { WeightPipe } from '../shared/pipes/weight.pipe';
import { DeviceService } from '../twilio/services/device.service';
import { StorageService } from '../twilio/services/storage.service';
import { merge } from 'rxjs';
import { VideoChatService } from '../twilio/services/videochat.service';
import { tap } from 'rxjs/operators';
import { TicketService } from './ticket.service';
import { of } from 'rxjs';
import { TicketDialogComponent } from './ticket-dialog/ticket-dialog.component';
describe('TicketComponent', () => {
  let component: TicketComponent;
  let fixture: ComponentFixture<TicketComponent>;
  let appModule = new AppModule();
  let ticketService: TicketService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketComponent],
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
        TicketService,
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
    fixture = TestBed.createComponent(TicketComponent);
    component = fixture.componentInstance;
    ticketService = TestBed.inject(TicketService);
    // spyOn(ticketService, 'getAllRequest').and.returnValue(
    //   of({
    //     content: [
    //       {
    //         patient: {
    //           firstName: 'John',
    //         },
    //         lastComment: 'Test comment',
    //         doctor: {
    //           name: 'Dr. Smith',
    //         },
    //         requestedDate: '2022-03-16T12:00:00Z',
    //       },
    //     ],
    //     totalElements: 1,
    //   })
    // );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display patient first name', () => {
    const patientName =
      fixture.nativeElement.querySelector('.patient.firstName');
    expect(patientName.textContent).toContain('John');
  });

  it('should display last comment', () => {
    const lastComment = fixture.nativeElement.querySelector('.lastComment');
    expect(lastComment.textContent).toContain('Test comment');
  });

  it('should display doctor name', () => {
    const doctorName = fixture.nativeElement.querySelector('.doctor.name');
    expect(doctorName.textContent).toContain('Dr. Smith');
  });

  it('should display requested date', () => {
    const requestedDate = fixture.nativeElement.querySelector('.requestedDate');
    expect(requestedDate.textContent).toContain('Mar 16, 2022');
  });

  it('should call getAllRequest on initialization', () => {
    expect(ticketService.getAllRequest).toHaveBeenCalled();
  });

  it('should call getAllRequest with correct parameters when pagination or sorting is changed', () => {
    const sort = fixture.componentInstance.sort;
    sort.active = 'requestedDate';
    sort.direction = 'asc';
    const paginator = fixture.componentInstance.paginator;
    paginator.pageIndex = 1;
    merge(sort.sortChange, paginator.page)
      .pipe(tap(() => fixture.componentInstance.getRequestList()))
      .subscribe();
    expect(ticketService.getAllRequest).toHaveBeenCalledWith(
      1,
      10,
      'requestedDate',
      'asc',
      null
    );
  });

  it('should open ticket dialog when addTicket is called', () => {
    spyOn(component.ticketModalPopup, 'open').and.callThrough();
    component.addTicket(1);
    expect(component.ticketModalPopup.open).toHaveBeenCalledWith(
      TicketDialogComponent,
      jasmine.objectContaining({
        data: jasmine.objectContaining({
          patientId: 1,
        }),
      })
    );
  });
});
