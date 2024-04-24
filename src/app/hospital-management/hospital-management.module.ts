import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { hospitalManagementRoutingModule } from './hospital.management.routing.module';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from '../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { hospitalUserComponent } from './hospital-user/hospital-user.component';
import { HospitalAddEditUserComponent } from './hospital-user/hospital-add-edit-user/hospital-add-edit-user.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { ViewDevicesComponent } from './view-devices/view-devices.component';
import { AssignDevicesComponent } from './view-devices/assign-devices/assign-devices.component';
import { UnAssignDevicesComponent } from './view-devices/un-assign-devices/un-assign-devices.component';
import { SharedModule } from '../branches/shareModule..module';
import { HospitalComponent } from './hospital/hospital.component';
import { HospitalAddEditComponent } from './hospital/hospital-add-edit/hospital-add-edit.component';
import { HospitalClinicComponent } from './hospital-clinic/hospital-clinic.component';
const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  // eslint-disable-next-line max-len
  declarations: [HospitalComponent, HospitalAddEditComponent, HospitalAddEditUserComponent, HospitalClinicComponent, ViewDevicesComponent, AssignDevicesComponent, UnAssignDevicesComponent],
  imports: [
    CommonModule,
    hospitalManagementRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    LayoutModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    SharedModule,
    MatAutocompleteModule,
    NgxMaskModule.forRoot(maskConfig)
  ]
})
export class hospitalManagementModule { }
