import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { NavComponent } from './components/nav/nav.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../angular-material.module';
import { LoaderComponent } from './components/loader/loader.component';
import { HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptorService } from './interceptors/loader-interceptor.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TimerComponent } from './components/timer/timer.component';
import { StopTimerComponent } from './components/stop-timer/stop-timer.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { PermissionDirective } from './directives/permission.directive';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberCustomValidationDirective } from './directives/number-custom-validation.directive';
import { AlphabetSpaceOnlyDirective } from './directives/alphabet-space-only.directive';
import { HotToastModule } from '@ngneat/hot-toast';
import { JwPaginationModule } from 'jw-angular-pagination';
import { NoDataFoundComponent } from './components/no-data-found/no-data-found.component';
import { ProfileImageComponent } from './components/profile-image/profile-image.component';
import { UserRolePipe } from './pipes/user-role.pipe';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
// import { NgOtpInputModule } from 'ng-otp-input';
import { TimeoutDialogComponent } from '../timeout-dialog/timeout-dialog.component';
import { HttpErrorInterceptor } from './interceptors/error-response-interceptor.service';
import { DevicesComponent } from '../twilio/devices/devices.component';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { HeaderComponent } from '../navigation/header/header.component';
import { AllFiltersComponent } from './components/all-filters/all-filters.component';
import { CallScheduleComponent } from '../CommonComponents/call-schedule/call-schedule.component';
import { AlphabetNumericOnlyDirective } from './directives/alphabet-numeric-only.directive';
import { PreventScrollDirective } from './directives/preventScroll.directive';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime-ex';
import { NoFirstSpaceDirective } from './directives/no-first-space.directive';
import { RestrictInputDirective } from './directives/forgotPass-pattern.directive';
import { NoFirstZeroDirective } from './directives/no-first-zero.directive';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

const components: any[] = [
  NavigationBarComponent,
  NavComponent,
  PageNotFoundComponent,
  TimerComponent,
  StopTimerComponent,
  AccessDeniedComponent,
  LoaderComponent,
  PermissionDirective,
  NumberCustomValidationDirective,
  NoFirstSpaceDirective,
  AlphabetSpaceOnlyDirective,
  RestrictInputDirective,
  NoFirstZeroDirective,
  AlphabetNumericOnlyDirective,
  PreventScrollDirective,
  NoDataFoundComponent,
  ProfileImageComponent,
  UserRolePipe,
  ImageUploadComponent,
  TimeoutDialogComponent,
  DevicesComponent,
  HeaderComponent,
  CallScheduleComponent,
  // CallSchedulerComponent,
];

@NgModule({
  declarations: [
    ...components,
    AllFiltersComponent,
    CallScheduleComponent,
    NoFirstSpaceDirective,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    HotToastModule,
    JwPaginationModule,
    AgmCoreModule,
    GooglePlaceModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaskModule.forRoot(maskConfig),
    // NgOtpInputModule
  ],
  exports: [...components],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
})
export class CoreModule {
  constructor(
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'previous',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/previous.svg'
      )
    );
  }
}
