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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire';
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
// import { MatPaginator, MatSort } from '@angular/material';
import {
  MatDialog,
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
import { RouterTestingModule } from '@angular/router/testing';
import { NotifierModule, NotifierService } from 'angular-notifier';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime-ex';
import { ChartsModule } from 'ng2-charts';
import { of } from 'rxjs';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { WeightPipe } from 'src/app/shared/pipes/weight.pipe';
import { DeviceService } from 'src/app/twilio/services/device.service';
import { StorageService } from 'src/app/twilio/services/storage.service';
import { VideoChatService } from 'src/app/twilio/services/videochat.service';
import { environment } from 'src/environments/environment';
import { CptCodeService } from '../services/cpt-code.service';
import { AddCptComponent } from './add-cpt/add-cpt.component';
// import { CPTDataSource } from './cpt-data-source';
// import { CptCode } from './cpt-code';
// import { CptCodeService } from './cpt-code.service';
// import { SnackbarService } from '../snackbar/snackbar.service';
import { CptCodeComponent } from './cpt-code.component';
import { EditCptComponent } from './edit-cpt/edit-cpt.component';

describe('CptCodeComponent', () => {
  let component: CptCodeComponent;
  let fixture: ComponentFixture<CptCodeComponent>;
  let cptCodeServiceSpy: jasmine.SpyObj<CptCodeService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    cptCodeServiceSpy = jasmine.createSpyObj('CptCodeService', ['loadCodes']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['error']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [CptCodeComponent],
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
        { provide: CptCodeService, useValue: cptCodeServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
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
    fixture = TestBed.createComponent(CptCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load codes on initialization', () => {
    spyOn(component.dataSource, 'loadCodes');
    component.ngOnInit();
    expect(component.dataSource.loadCodes).toHaveBeenCalledOnceWith(0, 0);
  });

  it('should load codes on sort or page change', () => {
    spyOn(component.dataSource, 'loadCodes');
    component.ngAfterViewInit();
    component.paginator.page.emit();
    component.sort.sortChange.emit();
    expect(component.dataSource.loadCodes).toHaveBeenCalledTimes(2);
  });

  it('should reset filter and load codes when global search is disabled', () => {
    spyOn(component.dataSource, 'loadCodes');
    component.unselectGlobalSearch();
    expect(component.cptfilter.get('searchQuery').value).toEqual('');
    expect(component.isEnableGlobalSearch).toBeFalse();
    expect(component.dataSource.loadCodes).toHaveBeenCalledOnceWith(0, 0);
  });

  it('should load codes and enable global search when query is longer than 2 characters', () => {
    spyOn(component.dataSource, 'loadCodes');
    component.cptfilter.get('searchQuery').setValue('test');
    component.isEnableGlobalSearchFunc();
    expect(component.isEnableGlobalSearch).toBeTrue();
    expect(component.dataSource.loadCodes).toHaveBeenCalledOnceWith(
      0,
      0,
      undefined,
      undefined,
      'test'
    );
  });

  it('should load codes and disable global search when query is cleared', () => {
    spyOn(component.dataSource, 'loadCodes');
    component.cptfilter.get('searchQuery').setValue('');
    component.isEnableGlobalSearchFunc();
    expect(component.isEnableGlobalSearch).toBeFalse();
    expect(component.dataSource.loadCodes).toHaveBeenCalledOnceWith(0, 0);
  });

  it('should not load codes and show error when invalid search query is entered', () => {
    spyOn(component.snackbarService, 'error');
    component.cptfilter.get('searchQuery').setValue('!@#$');
    component.onCptFilter();
    expect(component.snackbarService.error).toHaveBeenCalledOnceWith(
      'Enter valid text'
    );
    expect(component.dataSource.loadCodes).not.toHaveBeenCalled();
  });

  // it('should load codes and update success message when data is available', () => {
  //   spyOn(component.dataSource, 'loadCodes');
  //   component.ngOnInit();
  //   component.dataSource.totalElemObservable.next(10);
  //   expect(component.messageSuccess).toBeTrue();
  //   expect(component.dataSource.loadCodes).toHaveBeenCalled();
  // });

  // it('should not update success message when no data is available', () => {
  //   spyOn(component.dataSource, 'loadCodes');
  //   component.ngOnInit();
  //   component.dataSource.totalElemObservable.next(0);
  //   expect(component.messageSuccess).toBeFalse();
  //   expect(component.dataSource.loadCodes).toHaveBeenCalled();
  // });

  it('should open add cpt code dialog and refresh table on close', () => {
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(null),
    } as MatDialogRef<AddCptComponent>);
    spyOn(component.dataSource, 'loadCodes');
    component.openAddCPTCodeDialog();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component.dataSource.loadCodes).toHaveBeenCalled();
  });

  it('should open edit cpt code dialog and refresh table on close', () => {
    const CptCode = {
      id: 1,
      code: '12345',
      description: 'Test code',
      price: 100,
    };
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(null),
    } as MatDialogRef<EditCptComponent>);
    spyOn(component.dataSource, 'loadCodes');
    // component.openEditCPTCodeDialog( CptCode);
    expect(component.dialog.open).toHaveBeenCalledOnceWith(EditCptComponent, {
      data: CptCode,
      width: '500px',
    });
    expect(component.dataSource.loadCodes).toHaveBeenCalled();
  });
});
