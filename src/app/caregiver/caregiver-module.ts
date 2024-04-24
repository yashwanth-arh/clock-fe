import { NgModule } from '@angular/core';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule, LayoutGapStyleBuilder } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from '../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CaregiverComponent } from './caregiver.component';
import { CaregiverRoutingModule } from './caregiver-routing.module';
import { CaregiverDialogComponent } from './caregiver-dialog/caregiver-dialog.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CaregiverService } from '../caregiver/caregiver.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomLayoutGapStyleBuilder } from '../app.module';
import { CheckOsType } from '../core/interceptors/check-os-type';
import { SettingsStateService } from '../core/services/settings-state.service';
import { SnackbarService } from '../core/services/snackbar.service';
import { PushNotificationService } from '../Firebase Service/push-notification.service';
import { WeightPipe } from '../shared/pipes/weight.pipe';
import { DeviceService } from '../twilio/services/device.service';
import { StorageService } from '../twilio/services/storage.service';
import { VideoChatService } from '../twilio/services/videochat.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    CaregiverComponent,
    CaregiverDialogComponent,
  ],
  imports: [
    CommonModule,
    CaregiverRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    LayoutModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxMaskModule,
    MatAutocompleteModule,
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
    CaregiverService,
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
  exports: [AsyncPipe],
})
export class CaregiverManagementModule {}
