import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BranchRoutingModule } from './branch-routing.module';
import { AngularMaterialModule } from '../../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from '../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BranchAddEditComponent } from './branch-add-edit/branch-add-edit.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { OwlDateTimeModule } from 'ng-pick-datetime-ex';
import { OwlNativeDateTimeModule } from 'ng-pick-datetime';
const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [BranchListComponent, BranchAddEditComponent],
  imports: [
    CommonModule,
    BranchRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    LayoutModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    OwlDateTimeModule,
    // OwlNativeDateTimeModule,
    NgxMaskModule.forRoot(maskConfig),
  ],
  providers: [AsyncPipe],
})
export class BranchModule {}
