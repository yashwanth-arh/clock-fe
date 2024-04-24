import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from '../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { IConfig, NgxMaskModule } from 'ngx-mask';
import { LeadershipBoardRoutingModule } from './leadership-board-routing.module';
import { LeadershipBoardPatientComponent } from './leadership-board-patient/leadership-board-patient.component';
const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  // eslint-disable-next-line max-len
  declarations: [
    LeadershipBoardPatientComponent,LeadershipBoardPatientComponent
  ],
  imports: [
    CommonModule,
    LeadershipBoardRoutingModule,
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
export class LeadershipBoardModule { }
