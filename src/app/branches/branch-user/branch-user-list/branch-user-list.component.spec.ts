import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogConfig,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BranchUserListComponent } from './branch-user-list.component';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { AsyncPipe, CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { AppModule, CustomLayoutGapStyleBuilder } from 'src/app/app.module';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { FlexLayoutModule, CoreModule, LayoutGapStyleBuilder } from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
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
import { BranchUserService } from '../branch-user.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToolbarService } from 'src/app/core/services/toolbar.service';
import { BranchAddEditUserComponent } from '../branch-add-edit-user/branch-add-edit-user.component';
import { of } from 'rxjs';

describe('BranchUserListComponent', () => {
  let component: BranchUserListComponent;
  let fixture: ComponentFixture<BranchUserListComponent>;
  let appModule = new AppModule();
  let branchUserService: BranchUserService;
  let toolbarService: jasmine.SpyObj<ToolbarService>;
  let mockBranchUserService;
  let dataSource: any;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: appModule.declarations,
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
    fixture = TestBed.createComponent(BranchUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.dataSource = dataSource;
    providers: [{ provide: BranchUserService, useValue: mockBranchUserService }]
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter the list of status options based on user input', () => {
    component.status = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];
    component.StatusFilteredOptions = component.hospitalUserStatus.valueChanges.pipe();
    component.hospitalUserStatus.setValue('AC');
    component.StatusFilteredOptions.subscribe((options) => {
      expect(options).toEqual(['ACTIVE']);
    });
  });

  it('should have userColumnHeaders with correct values', () => {
    expect(component.userColumnHeaders).toEqual(['firstName', 'designation', 'emailId', 'contactNumber', 'status']);
  });







 
});
