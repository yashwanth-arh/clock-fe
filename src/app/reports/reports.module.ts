import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// import { SettingsManagementRoutingModule } from "./settings-management-routing.module";
// import { DieseaseComponent } from "./disease/diesease.component";
import { AngularMaterialModule } from "../angular-material.module";
import { CoreModule } from "../core/core.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
// import { AddDiseaseComponent } from "./disease/add-disease/add-disease.component";
// import { EditDiseaseComponent } from "./disease/edit-disease/edit-disease.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
// import { CptCodeComponent } from "./cpt-code/cpt-code.component";
// import { AddCptComponent } from "./cpt-code/add-cpt/add-cpt.component";
// import { EditCptComponent } from "./cpt-code/edit-cpt/edit-cpt.component";
// import { SpecialityAddEditComponent } from "./speciality/speciality-add-edit/speciality-add-edit.component";
// import { SpecialityListComponent } from "./speciality/speciality-list/speciality-list.component";
// import { DeviceTypeAddComponent } from "./device-type/device-type-add/device-type-add.component";
// import { DeviceTypeEditComponent } from "./device-type/device-type-edit/device-type-edit.component";
// import { DeviceTypeListComponent } from "./device-type/device-type-list/device-type-list.component";
import { ReportRoutingModule } from "./reports-routing.module";
import { LogHistoryComponent } from "./log-history/log-history/log-history.component";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { LogHistoryTabsComponent } from './log-history/log-history/log-history-tabs/log-history-tabs.component';
@NgModule({
  declarations: [
    // DieseaseComponent,
    // AddDiseaseComponent,
    // EditDiseaseComponent,
    // CptCodeComponent,
    // AddCptComponent,
    // EditCptComponent,
    // SpecialityListComponent,
    // SpecialityAddEditComponent,
    // DeviceTypeAddComponent,
    // DeviceTypeEditComponent,
    // DeviceTypeListComponent,
    LogHistoryComponent,
    LogHistoryTabsComponent
  ],
  imports: [
    CommonModule,
    // SettingsManagementRoutingModule,
    CoreModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReportRoutingModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  exports: [LogHistoryComponent,MatSortModule],
})
export class ReportModule { }
