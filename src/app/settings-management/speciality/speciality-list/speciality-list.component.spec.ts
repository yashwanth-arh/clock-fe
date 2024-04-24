import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SpecialityListComponent } from './speciality-list.component';
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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
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
import { SpecialityService } from '../../services/speciality.service';
import { of, throwError } from 'rxjs';

describe('SpecialityListComponent', () => {
  let component: SpecialityListComponent;
  let fixture: ComponentFixture<SpecialityListComponent>;
  let specialtyservice: SpecialityService;
  let snackBarService: SnackbarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecialityListComponent],
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
        {
          provide: Router,
          useValue: {
            routerState: { snapshot: { url: '' } },
            navigate: jasmine.createSpy('navigate'),
          },
        },
        {
          provide: MatDialog,
          useValue: jasmine.createSpyObj('MatDialog', ['open']),
        },
        {
          provide: SpecialityService,
          useValue: jasmine.createSpyObj('SpecialityService', [
            'getAllSpecialty',
          ]),
        },
        {
          provide: SnackbarService,
          useValue: jasmine.createSpyObj('SnackbarService', ['error']),
        },
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
    fixture = TestBed.createComponent(SpecialityListComponent);
    component = fixture.componentInstance;
    specialtyservice = TestBed.inject(SpecialityService);
    snackBarService = TestBed.inject(SnackbarService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login page if token is not present and current URL is not login page', () => {
    const router = TestBed.inject(Router);
    spyOnProperty(router.routerState.snapshot, 'url').and.returnValue(
      '/some-page'
    );
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not navigate to login page if token is not present and current URL is login page', () => {
    const router = TestBed.inject(Router);
    spyOnProperty(router.routerState.snapshot, 'url').and.returnValue('/login');
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not navigate to login page if token is present', () => {
    const router = TestBed.inject(Router);
    spyOn(localStorage, 'getItem').and.returnValue('some-token');
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call getAllSpecialty method of SpecialityService and set dataSource and length properties when getSpecialtyList is called', () => {
    const data = {
      content: [{ id: 1, name: 'Speciality 1' }],
      totalElements: 1,
    };
    const spy = spyOn(specialtyservice, 'getAllSpecialty').and.returnValue(
      of(data)
    );
    component.getSpecialtyList();
    expect(spy).toHaveBeenCalledWith(0, 10, 'createdAt', 'desc', null);
    expect(component.dataSource.data).toEqual(data.content);
    expect(component.length).toEqual(data.totalElements);
    expect(component.pageIndex).toEqual(0);
  });

  it('should show error message when getSpecialtyList throws an error', () => {
    const error = { message: 'Something went wrong' };
    spyOn(specialtyservice, 'getAllSpecialty').and.returnValue(
      throwError(error)
    );
    spyOn(snackBarService, 'error');
    component.getSpecialtyList();
    expect(snackBarService.error).toHaveBeenCalledWith(error.message);
  });

  it('should call getSpecialtyList with proper arguments when sort is changed', () => {
    const event = { active: 'name', direction: 'asc' } as Sort;
    const spy = spyOn(component, 'getSpecialtyList');
    // component.onSortChange(event);
    expect(component.sort.active).toEqual('name');
    expect(component.sort.direction).toEqual('asc');
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSpecialtyList with proper arguments when paginator is changed', () => {
    const event = { pageIndex: 1, pageSize: 10 } as PageEvent;
    const spy = spyOn(component, 'getSpecialtyList');
    // component.onPageChange(event);
    expect(component.paginator.pageIndex).toEqual(1);
    expect(component.paginator.pageSize).toEqual(10);
    expect(spy).toHaveBeenCalled();
  });

  it('should open SpecialityDialog when addSpecialty is called', () => {
    const dialog = TestBed.inject(MatDialog);
    component.addSpecialty();
    expect(dialog.open).toHaveBeenCalled();
  });
});
