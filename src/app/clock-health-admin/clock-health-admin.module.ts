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
import { ClockHealthAdminComponent } from './clock-health-admin.component';
import { ClockHealthAdminRoutingModule } from './clock-health-admin-routing.module';
const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [ClockHealthAdminComponent],
  imports: [
    CommonModule,
    ClockHealthAdminRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    LayoutModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    NgxMaskModule.forRoot(maskConfig),
  ],
})
export class ClockHealthAdminModule {}
