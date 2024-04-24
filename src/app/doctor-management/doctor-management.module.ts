import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorComponent } from './doctor/doctor.component';
import { DoctorDialogComponent } from './doctor/doctor-dialog/doctor-dialog.component';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from '../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DoctorManagementRoutingModule } from './doctor-management-routing.module';
import { IConfig, NgxMaskModule } from 'ngx-mask';
const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [DoctorComponent, DoctorDialogComponent],
  imports: [
    CommonModule,
    DoctorManagementRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    LayoutModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    NgxMaskModule.forRoot(maskConfig)
  ]
})
export class DoctorManagementModule { }
