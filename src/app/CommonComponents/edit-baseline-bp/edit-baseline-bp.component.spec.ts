import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { EditBaselineBpComponent } from './edit-baseline-bp.component';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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

describe('EditBaselineBpComponent', () => {
  let component: EditBaselineBpComponent;
  let fixture: ComponentFixture<EditBaselineBpComponent>;
  let appModule = new AppModule();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditBaselineBpComponent],
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
        DecimalPipe, MatSnackBar,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: HTTP_INTERCEPTORS, useClass: CheckOsType, multi: true },
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 1,
            data: 120,
            dia: 80
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBaselineBpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.deviceTypeForm.value.baseLineSys).toBe(120);
    expect(component.deviceTypeForm.value.baseLineDia).toBe(80);
  });

  it('should set baseLineSys as required', () => {
    const baseLineSys = component.deviceTypeForm.controls['baseLineSys'];
    baseLineSys.setValue(null);
    expect(baseLineSys.valid).toBeFalsy();
    expect(baseLineSys.errors['required']).toBeTruthy();
  });


  it('should set baseLineSys as between 30 and 500', () => {
    const baseLineSys = component.deviceTypeForm.controls['baseLineSys'];
    baseLineSys.setValue(29);
    expect(baseLineSys.valid).toBeFalsy();
    expect(baseLineSys.errors['min']).toBeTruthy();
    baseLineSys.setValue(501);
    expect(baseLineSys.valid).toBeFalsy();
    expect(baseLineSys.errors['max']).toBeTruthy();
  });

  it('should set baseLineDia as required', () => {
    const baseLineDia = component.deviceTypeForm.controls['baseLineDia'];
    baseLineDia.setValue(null);
    expect(baseLineDia.valid).toBeFalsy();
    expect(baseLineDia.errors['required']).toBeTruthy();
  });

  it('should set baseLineDia as between 30 and 500', () => {
    const baseLineDia = component.deviceTypeForm.controls['baseLineDia'];
    baseLineDia.setValue(29);
    expect(baseLineDia.valid).toBeFalsy();
    expect(baseLineDia.errors['min']).toBeTruthy();
    baseLineDia.setValue(501);
    expect(baseLineDia.valid).toBeFalsy();
    expect(baseLineDia.errors['max']).toBeTruthy();
  });
});
