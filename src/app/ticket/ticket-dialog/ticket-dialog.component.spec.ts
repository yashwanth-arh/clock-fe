import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketDialogComponent } from './ticket-dialog.component';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
import { TicketService } from '../ticket.service';
import { of, throwError } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
describe('TicketDialogComponent', () => {
  let component: TicketDialogComponent;
  let fixture: ComponentFixture<TicketDialogComponent>;
  let dialog: MatDialog;
  let ticketService: TicketService;
  let snackBarService: SnackbarService;
  beforeEach(async () => {
    const ticketServiceMock = jasmine.createSpyObj('TicketService', [
      'getRequestById',
      'addRequest',
    ]);
    const snackBarServiceMock = jasmine.createSpyObj('SnackbarService', [
      'error',
    ]);
    const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [TicketDialogComponent],
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
        { provide: TicketService, useValue: ticketServiceMock },
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
    fixture = TestBed.createComponent(TicketDialogComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    ticketService = TestBed.inject(TicketService);
    snackBarService = TestBed.inject(SnackbarService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('applyFilter', () => {
    it('should filter the data source based on the input', () => {
      // arrange
      // const event = { target: { value: 'filter' } } as Event;
      const dataSource = new MatTableDataSource<any>([
        {
          id: 1,
          description: 'test 1',
          raisedby: 'user1',
          closedBy: '',
          requestedDate: '2022-03-16',
          status: 'open',
        },
        {
          id: 2,
          description: 'test 2',
          raisedby: 'user2',
          closedBy: '',
          requestedDate: '2022-03-16',
          status: 'open',
        },
      ]);
      component.dataSource = dataSource;

      // act
      component.applyFilter(event);

      // assert
      expect(component.dataSource.filter).toBe('filter');
    });

    it('should go to the first page of the paginator if it exists', () => {
      // arrange
      // const event = { target: { value: 'filter' } } as Event;
      const dataSource = new MatTableDataSource<any>([
        {
          id: 1,
          description: 'test 1',
          raisedby: 'user1',
          closedBy: '',
          requestedDate: '2022-03-16',
          status: 'open',
        },
        {
          id: 2,
          description: 'test 2',
          raisedby: 'user2',
          closedBy: '',
          requestedDate: '2022-03-16',
          status: 'open',
        },
      ]);
      component.dataSource = dataSource;
      const paginator = { firstPage: jasmine.createSpy() };
      // component.paginator = paginator;

      // act
      component.applyFilter(event);

      // assert
      expect(paginator.firstPage).toHaveBeenCalled();
    });
  });
  describe('openTicketDialog', () => {
    it('should open the dialog and call the TicketService createTicket method when adding a new ticket', () => {
      // arrange
      // spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({}) });
      const ticket = {
        id: 1,
        description: 'test',
        raisedby: 'user',
        closedBy: '',
        requestedDate: '2022-03-16',
        status: 'open',
      };
      spyOn(ticketService, 'createTicket').and.returnValue(of(ticket));
      spyOn(snackBarService, 'openSnackBar');
      // act
      // component.openTicketDialog();

      // assert
      expect(dialog.open).toHaveBeenCalled();
      expect(ticketService.createTicket).toHaveBeenCalled();
      expect(snackBarService.openSnackBar).toHaveBeenCalledWith(
        'Ticket created successfully',
        'Close'
      );
    });

    it('should open the dialog and call the TicketService updateTicket method when editing an existing ticket', () => {
      // arrange
      // spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({}) });
      const ticket = {
        id: 1,
        description: 'test',
        raisedby: 'user',
        closedBy: '',
        requestedDate: '2022-03-16',
        status: 'open',
      };
      spyOn(ticketService, 'updateTicket').and.returnValue(of(ticket));
      spyOn(snackBarService, 'openSnackBar');
      component.dataSource = new MatTableDataSource<any>([ticket]);

      // act
      component.editTicket(ticket);

      // assert
      expect(dialog.open).toHaveBeenCalled();
      expect(ticketService.updateTicket).toHaveBeenCalled();
      expect(snackBarService.openSnackBar).toHaveBeenCalledWith(
        'Ticket updated successfully',
        'Close'
      );
    });
  });
});
