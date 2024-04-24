import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from '../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicTableModule } from 'material-dynamic-table';
import { AgGridModule } from 'ag-grid-angular';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SupportTicketComponent } from './support-ticket.component';
import { SupportTicketRoutingModule } from './support-ticket-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TicketTitleComponent } from './ticket-title/ticket-title.component';
import { SupportTabComponent } from './support-tab/support-tab.component';
const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [SupportTicketComponent,TicketTitleComponent, SupportTabComponent],
  imports: [
    CommonModule,
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
    SupportTicketRoutingModule,
    MatTabsModule,
    AgGridModule.withComponents([]),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'en-US',
    },
    SupportTicketComponent
  ],
})
export class SupportTicketModule {
  constructor(
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}
}
