import { environment } from './../environments/environment';
import { ChartsComponent } from './core/components/charts/charts.component';
import { CaregiverdashboardComponent } from './CareproviderDashboard/caregiverdashboard/caregiverdashboard.component';
import { BrowserModule } from '@angular/platform-browser';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ErrorHandler,
  Injectable,
  NgModule,
} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FlexLayoutModule,
  LayoutGapParent,
  LayoutGapStyleBuilder,
  StyleDefinition,
} from '@angular/flex-layout';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { TicketComponent } from './ticket/ticket.component';
import { TicketDialogComponent } from './ticket/ticket-dialog/ticket-dialog.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PatientDataComponent } from './patient-data/patient-data.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { ChartsModule } from 'ng2-charts';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { EditProfileComponent } from './userprofile/edit-profile/edit-profile.component';
import { ResetPasswordComponent } from './userprofile/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
// import { BranchUserListComponent } from './branches/branch-user/branch-user-list/branch-user-list.component';
import { BranchAddEditUserComponent } from './branches/branch-user/branch-add-edit-user/branch-add-edit-user.component';
import { PatientDeviceAddEditComponent } from './patient-management/patient-device/patient-device-add-edit/patient-device-add-edit.component';
import { PatientDeviceListComponent } from './patient-management/patient-device/patient-device-list/patient-device-list.component';
import { OrgClinicEditComponent } from './hospital-management/hospital-clinic/org-clinic-edit/org-clinic-edit.component';
import { HeaderComponent } from './navigation/header/header.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DoctorClinicComponent } from './doctor-management/doctor-clinic/doctor-clinic.component';
// import { NgxPaginationModule } from 'ngx-pagination';
import { NgxEchartsModule } from 'ngx-echarts';
import { DocDashboardComponent } from './doctor-dashboard/doc-dashboard/doc-dashboard.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { HotToastModule } from '@ngneat/hot-toast';
import { DoctorDashboardComponent } from './dashboard/doctor-dashboard/doctor-dashboard.component';
import { DefaultDashboardComponent } from './dashboard/default-dashboard/default-dashboard.component';
import { TotalPatientsComponent } from './CommonComponents/total-patients/total-patients.component';
import { CareproviderPatientListComponent } from './CareproviderDashboard/careprovider-patient-list/careprovider-patient-list.component';
import { CareproviderMessageDialogComponent } from './CareproviderDashboard/careprovider-message-dialog/careprovider-message-dialog.component';
import { ObservationHistoryComponent } from './CommonComponents/observation-history/observation-history.component';
import { VitalsHistoryComponent } from './CommonComponents/vitals-history/vitals-history.component';
import { RouterModule } from '@angular/router';
import { ClinicTimingsComponent } from './branches/branch/clinic-timings/clinic-timings.component';
import { DoctorPatientsDetailsComponent } from './CommonComponents/doctor-patients-details/doctor-patients-details.component';
import { NoteReadMoreComponent } from './CommonComponents/notes/note-read-more/note-read-more.component';
import { ParticipantsComponent } from './twilio/participants/participants.component';
import { SettingsComponent } from './twilio/settings/settings.component';
import { DeviceSelectComponent } from './twilio/device-select/device-select.component';
import { DeviceService } from './twilio/services/device.service';
import { VideoChatService } from './twilio/services/videochat.service';
import { StorageService } from './twilio/services/storage.service';
import { NotificationDialogComponent } from './CommonComponents/notification-dialog/notification-dialog.component';
import { ConfirmDialogComponent } from './CommonComponents/confirm-dialog/confirm-dialog.component';
import { MedicationComponent } from './CommonComponents/medication/medication.component';
import { NoteShareDialogComponent } from './CommonComponents/notes/note-share-dialog/note-share-dialog.component';
import { BpLineRangeChartComponent } from './CommonComponents/dashboard-graphs/bp-line-range-chart/bp-line-range-chart.component';
import { BpTrendPieChartComponent } from './CommonComponents/dashboard-graphs/bp-trend-pie-chart/bp-trend-pie-chart.component';
import { BpAdherenceChartComponent } from './CommonComponents/dashboard-graphs/bp-adherence-chart/bp-adherence-chart.component';
import { BGAdherenceChartComponent } from './CommonComponents/dashboard-graphs/bg-adherence-chart/bg-adherence-chart.component';
import { PatientAccountActivationComponent } from './patient-account-activation/patient-account-activation.component';
import { DeviceBulkUploadDialogComponent } from './device-management/device/device-bulk-upload-dialog/device-bulk-upload-dialog.component';
import { PatintBulkUploadMgmtComponent } from './patient-management/patient-mgmt/patint-bulk-upload-mgmt/patint-bulk-upload-mgmt.component';
import { VerifyOtpComponent } from './core/components/verify-otp/verify-otp.component';
import { AudioCallDialogComponent } from './CommonComponents/audio-call-dialog/audio-call-dialog.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { PushNotificationService } from './Firebase Service/push-notification.service';
import { CallSchedulerComponent } from './CommonComponents/call-scheduler/call-scheduler.component';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { UpdatePasswordComponent } from './dashboard/update-password/update-password.component';
import { ReportsComponent } from './reports/reports.component';

import { VideoCallComponent } from './twilio/video-call/video-call.component';
import { CameraComponent } from './twilio/camera/camera.component';
import { AudioCallComponent } from './twilio/audio-call/audio-call.component';
import { RoomsComponent } from './twilio/rooms/rooms.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { AddMedicationComponent } from './CommonComponents/medication/add-medication/add-medication.component';
import { AudioSettingsComponent } from './twilio/audio-settings/audio-settings.component';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime-ex';
import { WeightPipe } from './shared/pipes/weight.pipe';
import { SettingsStateService } from './core/services/settings-state.service';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PreviewImageComponent } from './CommonComponents/medication/preview-image/preview-image.component';
import { HeightPipe } from './shared/pipes/height.pipe';
import { PatientObservationComponent } from './CommonComponents/doctor-patients-details/patient-observation/patient-observation.component';
import { HighAlertComponent } from './CommonComponents/partials/high-alert/high-alert.component';
import { AlertComponent } from './CommonComponents/partials/alert/alert.component';
import { GoodComponent } from './CommonComponents/partials/good/good.component';
import { NonAdherenceComponent } from './CommonComponents/partials/non-adherence/non-adherence.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarService } from './core/services/snackbar.service';
import { CheckOsType } from './core/interceptors/check-os-type';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReportsTemplateComponent } from './CommonComponents/reports-template/reports-template.component';
import { TimeoutNotificationComponent } from './partials/timeout-notification/timeout-notification.component';
import { BpReportsComponent } from './CommonComponents/reports-template/bp-reports/bp-reports.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ActivationInfoPageComponent } from './core/components/activation-info-page/activation-info-page.component';
import { ImagePipe } from './shared/pipes/image.pipe';
import { DevicesComponent } from './twilio/devices/devices.component';
import { RedZoneDialogComponent } from './red-zone-dialog/red-zone-dialog.component';
import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';
import { AngularMaterialModule } from './angular-material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTabsModule } from '@angular/material/tabs';
import { BpReadingsMapViewComponent } from './CommonComponents/bp-readings-map-view/bp-readings-map-view.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { PatientConsentFormDialogComponent } from './patient-management/patient-mgmt/patient-consent-form-dialog/patient-consent-form-dialog.component';
import { LeadershipBoardComponent } from './leadership-board/leadership-board.component';
import { MedicationAdherenceChartComponent } from './CommonComponents/dashboard-graphs/medication-adherence-chart/medication-adherence-chart.component';
import { PatientDetailspageHeaderComponent } from './CommonComponents/patient-detailspage-header/patient-detailspage-header.component';
import { PatientDetailsSubHeaderComponent } from './CommonComponents/patient-details-sub-header/patient-details-sub-header.component';
import { EditBaselineBpComponent } from './CommonComponents/edit-baseline-bp/edit-baseline-bp.component';
import { EditClinicBpComponent } from './edit-clinic-bp/edit-clinic-bp.component';
import { UserSupportComponent } from './userprofile/user-support/user-support.component';
import { CreatesupportticketComponent } from './createsupportticket/createsupportticket.component';
// import { TicketTitleComponent } from './support-ticket/ticket-title/ticket-title.component';
import { TicketTitleDialogComponent } from './support-ticket/ticket-title/ticket-title-dialog/ticket-title-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { CaregiverService } from './caregiver/caregiver.service';
import { ContentMarketingPageComponent } from './content-marketing/content-marketing-page/content-marketing-page.component';
import { MedicalRecordsComponent } from './CommonComponents/medical-records/medical-records.component';
import { PrescriptionComponent } from './CommonComponents/doctor-patients-details/prescription/prescription.component';
import { AdherenceComponent } from './CommonComponents/doctor-patients-details/adherence/adherence.component';
import { ActionToggleDialogComponent } from './CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { ProviderFacilityMapComponent } from './care-provider-management/provider-facility-map/provider-facility-map.component';
import { ClockHealthAdminDialogComponent } from './clock-health-admin-dialog/clock-health-admin-dialog.component';
import { SharedModule } from './branches/shareModule..module';
import { CallHistoryComponent } from './twilio/call-history/call-history.component';
import { DiagnosticComponent } from './CommonComponents/doctor-patients-details/diagnostic/diagnostic.component';
import { AddDiagnosticComponent } from './CommonComponents/doctor-patients-details/diagnostic/add-diagnostic/add-diagnostic.component';
import { PastActivitiesDialogComponent } from './CommonComponents/partials/past-activities-dialog/past-activities-dialog.component';
import { CustomErrorHandler } from './errors/custom-error-handler/error-handler/custom-error-handler/custom-error-handler.component';
import { SharedTrendGraphComponent } from './CommonComponents/dashboard-graphs/shared-trend-graph/shared-trend-graph.component';
import { GuardiansComponent } from './CommonComponents/guardians/guardians.component';
import { ImagePreviewComponent } from './CommonComponents/doctor-patients-details/prescription/image-preview/image-preview.component';
import { MyCareTeamComponent } from './CommonComponents/doctor-patients-details/my-care-team/my-care-team.component';
// import { CareProviderMasterComponent } from './care-provider-management/care-provider-master/care-provider-master.component';
const maskConfig: Partial<IConfig> = {
  validation: false,
};

@Injectable()
export class CustomLayoutGapStyleBuilder extends LayoutGapStyleBuilder {
  buildStyles(gapValue: string, parent: LayoutGapParent): StyleDefinition {
    return super.buildStyles(gapValue || '0 px', parent);
  }

  sideEffect(gapValue, _styles, parent) {
    return super.sideEffect(gapValue || '0 px', _styles, parent);
  }
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TicketComponent,
    TicketDialogComponent,
    PatientDataComponent,
    DashboardComponent,
    UserprofileComponent,
    EditProfileComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    // BranchUserListComponent,
    BranchAddEditUserComponent,
    PatientDeviceListComponent,
    PatientDeviceAddEditComponent,
    OrgClinicEditComponent,
    CaregiverdashboardComponent,
    // HeaderComponent,
    DoctorClinicComponent,
    DoctorDashboardComponent,
    DefaultDashboardComponent,
    DocDashboardComponent,
    TotalPatientsComponent,
    CareproviderPatientListComponent,
    CareproviderMessageDialogComponent,
    ObservationHistoryComponent,
    VitalsHistoryComponent,
    MedicationComponent,
    ClinicTimingsComponent,
    DoctorPatientsDetailsComponent,
    NoteReadMoreComponent,
    ParticipantsComponent,
    CameraComponent,
    SettingsComponent,
    DeviceSelectComponent,
    NotificationDialogComponent,
    ConfirmDialogComponent,
    NoteShareDialogComponent,
    BpLineRangeChartComponent,
    BpTrendPieChartComponent,
    BpAdherenceChartComponent,
    BGAdherenceChartComponent,
    ChartsComponent,
    PatientAccountActivationComponent,
    DeviceBulkUploadDialogComponent,
    PatintBulkUploadMgmtComponent,
    VerifyOtpComponent,
    AudioCallDialogComponent,
    CallSchedulerComponent,
    UpdatePasswordComponent,
    VideoCallComponent,
    AudioCallComponent,
    RoomsComponent,
    ReportsComponent,
    AddMedicationComponent,
    AudioSettingsComponent,
    WeightPipe,
    PreviewImageComponent,
    HeightPipe,
    ImagePipe,
    PatientObservationComponent,
    HighAlertComponent,
    AlertComponent,
    GoodComponent,
    NonAdherenceComponent,
    ReportsTemplateComponent,
    TimeoutNotificationComponent,
    BpReportsComponent,
    ActivationInfoPageComponent,
    RedZoneDialogComponent,
    BpReadingsMapViewComponent,
    PatientConsentFormDialogComponent,
    LeadershipBoardComponent,
    MedicationAdherenceChartComponent,
    PatientDetailspageHeaderComponent,
    PatientDetailsSubHeaderComponent,
    EditBaselineBpComponent,
    EditClinicBpComponent,
    UserSupportComponent,
    CreatesupportticketComponent,
    // TicketTitleComponent,
    TicketTitleDialogComponent,
    MedicalRecordsComponent,
    PrescriptionComponent,
    AdherenceComponent,
    ActionToggleDialogComponent,
    ProviderFacilityMapComponent,
    ClockHealthAdminDialogComponent,
    CallHistoryComponent,
    AddDiagnosticComponent,
    MyCareTeamComponent,
    // ClockHealthAdminComponent,
    // ContentMarketingPageComponent,
    // CareProviderMasterComponent,
    DiagnosticComponent,
    PastActivitiesDialogComponent,
    SharedTrendGraphComponent,
    GuardiansComponent,
    ImagePreviewComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularMaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    ChartsModule,
    NgxDatatableModule,
    NgxChartsModule,
    CommonModule,
    MatInputModule,
    // NgxPaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatTabsModule,
    ChartsModule,
    MatSortModule,
    MatPaginatorModule,
    HotToastModule.forRoot(),
    NgxMaskModule.forRoot(maskConfig),
    NgIdleKeepaliveModule.forRoot(),
    MatTooltipModule,
    MatFormFieldModule,
    GooglePlaceModule,
    NotifierModule,
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
    NotifierModule.withConfig({
      // Custom options in here
    }),
    RouterModule.forRoot([]),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
    AgmCoreModule.forRoot({
      apiKey: '',
    }),
    NgxPaginationModule,
    NgOtpInputModule,
  ],

  entryComponents: [
    TicketDialogComponent,
    CareproviderMessageDialogComponent,
    NoteShareDialogComponent,
    DeviceBulkUploadDialogComponent,
    PatintBulkUploadMgmtComponent,
    VerifyOtpComponent,
  ],
  providers: [
    TitleCasePipe,
    CustomErrorHandler,
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
    NotifierService,
    HeightPipe,
    CaregiverService,
    // ApiTimeoutService,
    { provide: HTTP_INTERCEPTORS, useClass: CheckOsType, multi: true },
    { provide: LayoutGapStyleBuilder, useClass: CustomLayoutGapStyleBuilder },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    // { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
    // { provide: DEFAULT_TIMEOUT, useValue: environment.api_timeout }
    // { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [AsyncPipe, HeightPipe],
})
export class AppModule {
  imports: any[];
  providers: any;
  declarations: any[];
}
