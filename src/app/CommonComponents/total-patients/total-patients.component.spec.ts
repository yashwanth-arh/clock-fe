import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TotalPatientsComponent } from './total-patients.component';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
import { MatPaginator } from '@angular/material/paginator';

describe('TotalPatientsComponent', () => {
  let component: TotalPatientsComponent;
  let fixture: ComponentFixture<TotalPatientsComponent>;
  let appModule = new AppModule();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotalPatientsComponent],
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
    fixture = TestBed.createComponent(TotalPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call loadTotalPatients when search data is not present', () => {
    spyOn(component.dataSource, 'loadTotalPatients');
    localStorage.removeItem('totPatSearchValue');
    component.ngOnInit();
    expect(component.dataSource.loadTotalPatients).toHaveBeenCalledWith(0);
  });

  it('should call loadTotalPatientsBySearchQuery when search data is present', () => {
    spyOn(component.dataSource, 'loadTotalPatientsBySearchQuery');
    localStorage.setItem('totPatSearchValue', 'test search data');
    component.ngOnInit();
    expect(component.dataSource.loadTotalPatientsBySearchQuery).toHaveBeenCalledWith('test search data', 0);
  });
  describe('ngAfterViewInit()', () => {
    it('should subscribe to sort and paginator events', () => {
      spyOn(component.sort?.sortChange, 'subscribe');
      spyOn(component.paginator?.page, 'subscribe');
      component.ngAfterViewInit();
      expect(component.sort?.sortChange.subscribe).toHaveBeenCalled();
      expect(component.paginator?.page.subscribe).toHaveBeenCalled();
    });

    it('should call loadTotalPatients() on sort and paginator events', () => {
      spyOn(component, 'loadTotalPatients');
      component.ngAfterViewInit();
      component.sort?.sortChange.emit();
      expect(component.loadTotalPatients).toHaveBeenCalled();
      component.paginator?.page.emit();
      expect(component.loadTotalPatients).toHaveBeenCalledTimes(4);
    });
  });
  describe('loadTotalPatients()', () => {
    it('should update the page index in local storage', () => {
      spyOn(localStorage, 'setItem');
      component.paginator = { pageIndex: 3 } as MatPaginator;
      component.loadTotalPatients();
      expect(localStorage.setItem).toHaveBeenCalledWith('page-index', '3');
    });

    it('should call dataSource.loadTotalPatients() with the correct arguments', () => {
      component.paginator = { pageIndex: 2, pageSize: 10 } as MatPaginator;
      component.dataSource = { loadTotalPatients: jasmine.createSpy() } as any;
      component.loadTotalPatients();
      expect(component.dataSource.loadTotalPatients).toHaveBeenCalledWith(2, 10);
    });
  });
  it('should format the given date correctly', () => {
    const date = new Date('2022-03-08');
    const formattedDate = component.getDate(date);
    expect(formattedDate).toEqual('2022-03-08');
  });

  it('should return an empty string if the image input is empty', () => {
    const image = '';
    const sanitizedImage = component.getImage(image);
    expect(sanitizedImage).toEqual('');
  });

  it('should bypass security and return the sanitized image URL', () => {
    const image = 'https://example.com/image.png';
    const sanitizedImage = component.getImage(image);
    expect(sanitizedImage.toString()).toContain('https://example.com/image.png');
  });
});
