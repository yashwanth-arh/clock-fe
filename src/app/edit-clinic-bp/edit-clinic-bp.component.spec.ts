import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CheckOsType } from 'src/app/core/interceptors/check-os-type';
import { EditClinicBpComponent } from './edit-clinic-bp.component';
import { RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
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

describe('EditClinicBpComponent', () => {
  let component: EditClinicBpComponent;
  let fixture: ComponentFixture<EditClinicBpComponent>;
  let appModule = new AppModule();
  let mockDiseaseService = jasmine.createSpyObj(['updateClinicBp']);
  let mockSnackBar = jasmine.createSpyObj(['success', 'error']);
  // let matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditClinicBpComponent],
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
        // { provide: MatDialogRef, useClass: matDialogRefSpy },

        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClinicBpComponent);
    component = fixture.componentInstance;
    component.deviceTypeForm = new FormGroup({
      sysBp: new FormControl('120', Validators.required),
      diaBp: new FormControl('80', Validators.required),
    });
    component.data = { id: 1 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call DiseaseService.updateClinicBp() with correct arguments when form is valid', () => {
    const clinicBP = {
      sysBp: '120',
      diaBp: '80',
    };
    spyOn(component.diseaseService, 'updateClinicBp').and.returnValue(
      of(clinicBP)
    );
    spyOn(component.snackBar, 'success');
    component.deviceTypeForm.setValue(clinicBP);
    component.createDeviceType();
    expect(component.diseaseService.updateClinicBp).toHaveBeenCalledWith(
      {
        clinicBp: `${clinicBP.sysBp + '/' + clinicBP.diaBp}`,
      },
      1
    );
    expect(component.snackBar.success).toHaveBeenCalledWith(
      'Clinic BP edited sucessfully',
      2000
    );
  });

  it('should not call DiseaseService.updateClinicBp() when form is invalid', () => {
    component.deviceTypeForm.controls['sysBp'].setValue('');
    component.deviceTypeForm.controls['diaBp'].setValue('');
    component.createDeviceType();
    expect(mockDiseaseService.updateClinicBp).not.toHaveBeenCalled();
    expect(mockSnackBar.success).not.toHaveBeenCalled();
    // expect(matDialogRefSpy.close).not.toHaveBeenCalled();
  });
});
