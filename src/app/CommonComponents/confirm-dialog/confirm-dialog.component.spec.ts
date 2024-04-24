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
import { MatNativeDateModule } from '@angular/material/core';
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
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime-ex';
import { ChartsModule } from 'ng2-charts';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule, CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';

import { ConfirmDialogComponent, ConfirmDialogModel } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

  let mockDialogRef: MatDialogRef<ConfirmDialogComponent>;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let appModule = new AppModule();
  const mockData: ConfirmDialogModel = new ConfirmDialogModel('Title', 'Message');
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
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
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockDialogRef = TestBed.inject(MatDialogRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set the component properties correctly', () => {
    expect(component.tit).toEqual(mockData.tit);
    expect(component.title).toEqual(mockData.title);
    expect(component.message).toEqual(mockData.message);
    expect(component.titleboo).toBeTruthy();
  });
  it('should call dialogRef.close() when closeDialog() is called', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    // const mockDialogRef = jasmine.createSpyObj(['close']);
    // const spy = spyOn(mockDialogRef, 'close');
    component.closeDialog('Yes');
    expect(matDialogRefSpy.close).toHaveBeenCalledWith('Yes');
  });
});
