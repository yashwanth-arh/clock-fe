import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientManagementRoutingModule } from './patient-management-routing.module';
import { PatientMgmtComponent } from './patient-mgmt/patient-mgmt.component';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from '../core/core.module';
import { AddPatientComponent } from './patient-mgmt/add-patient/add-patient.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicTableModule } from 'material-dynamic-table';
import { AgGridModule } from 'ag-grid-angular';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { PatientConsentFormComponent } from './patient-mgmt/patient-consent-form/patient-consent-form.component';
const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    PatientMgmtComponent,
    AddPatientComponent,
    PatientConsentFormComponent,
  ],
  imports: [
    CommonModule,
    PatientManagementRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    LayoutModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    DynamicTableModule,
    NgxMaskModule,
    GooglePlaceModule,
    AgGridModule.withComponents([]),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'en-US',
    },
  ],
})
export class PatientManagementModule {
  constructor(
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'bp',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/arm.svg')
    );

    this.iconRegistry.addSvgIcon(
      'glucose',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/glucose.svg'
      )
    );

    this.iconRegistry.addSvgIcon(
      'diet',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/diet.svg')
    );

    this.iconRegistry.addSvgIcon(
      'heartrate',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/heart.svg'
      )
    );

    this.iconRegistry.addSvgIcon(
      'weight',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/weighing-scale.svg'
      )
    );

    this.iconRegistry.addSvgIcon(
      'oxygen',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/oxygen-mask.svg'
      )
    );

    this.iconRegistry.addSvgIcon(
      'sleep',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/sleeping.svg'
      )
    );

    this.iconRegistry.addSvgIcon(
      'activity',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/exercise.svg'
      )
    );

    this.iconRegistry.addSvgIcon(
      'doctor-comment',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/stethoscope.svg'
      )
    );

    this.iconRegistry.addSvgIcon(
      'pulse oxymeter',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/pulse-oxymeter.svg'
      )
    );

    this.iconRegistry.addSvgIcon(
      'temperature',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/temperature.svg'
      )
    );
  }
}
