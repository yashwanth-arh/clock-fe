import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SettingsManagementRoutingModule } from "./settings-management-routing.module";
import { DieseaseComponent } from "./disease/diesease.component";
import { AngularMaterialModule } from "../angular-material.module";
import { CoreModule } from "../core/core.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AddDiseaseComponent } from "./disease/add-disease/add-disease.component";
import { EditDiseaseComponent } from "./disease/edit-disease/edit-disease.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { CptCodeComponent } from "./cpt-code/cpt-code.component";
import { AddCptComponent } from "./cpt-code/add-cpt/add-cpt.component";
import { EditCptComponent } from "./cpt-code/edit-cpt/edit-cpt.component";
import { SpecialityAddEditComponent } from "./speciality/speciality-add-edit/speciality-add-edit.component";
import { SpecialityListComponent } from "./speciality/speciality-list/speciality-list.component";
import { SettingsManagementComponent } from './settings-management/settings-management.component';
import { DoctorIdentityComponent } from './doctor-identity/doctor-identity.component';
import { HospitalIdentityComponent } from './hospital-identity/hospital-identity.component';
import { DoctorIdentityAddEditComponent } from './doctor-identity/doctor-identity-add-edit/doctor-identity-add-edit.component';
import { HospitalIdentityAddEditComponent } from './hospital-identity/hospital-identity-add-edit/hospital-identity-add-edit.component';

@NgModule({
  declarations: [
    DieseaseComponent,
    AddDiseaseComponent,
    EditDiseaseComponent,
    CptCodeComponent,
    AddCptComponent,
    EditCptComponent,
    SpecialityListComponent,
    SpecialityAddEditComponent,
    SettingsManagementComponent,
    DoctorIdentityComponent,
    HospitalIdentityComponent,
    DoctorIdentityAddEditComponent,
    HospitalIdentityAddEditComponent,
  ],
  imports: [
    CommonModule,
    SettingsManagementRoutingModule,
    CoreModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatAutocompleteModule,
  ],
  exports: [DieseaseComponent],
})
export class SettingsManagementModule { }
