import { NgModule } from '@angular/core';
import { BranchUserListComponent } from './branch-user/branch-user-list/branch-user-list.component';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMaskModule } from 'ngx-mask';
import { AngularMaterialModule } from '../angular-material.module';
import { CareProviderManagementRoutingModule } from '../care-provider-management/care-provider-routing.module';
import { CoreModule } from '../core/core.module';
import { HospitalUserComponent } from '../hospital-management/hospital-user/hospital-user.component';
import { NotesAndCarePlansComponent } from '../CommonComponents/notes/notes-care-plans/notes-and-care-plans/notes-and-care-plans.component';
import { CarePlansListComponent } from '../CommonComponents/notes/notes-care-plans/care-plans-list/care-plans-list.component';
import { NotesListComponent } from '../CommonComponents/notes/notes-care-plans/notes-list/notes-list.component';

@NgModule({
  declarations: [
    BranchUserListComponent,
    HospitalUserComponent,
    NotesAndCarePlansComponent,
    NotesListComponent,
    CarePlansListComponent,
  ],
  exports: [
    BranchUserListComponent,
    HospitalUserComponent,
    NotesAndCarePlansComponent,
    NotesListComponent,
    CarePlansListComponent,
  ],
  imports: [
    CommonModule,
    CareProviderManagementRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    LayoutModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    CoreModule,
  ],
})
export class SharedModule {}
