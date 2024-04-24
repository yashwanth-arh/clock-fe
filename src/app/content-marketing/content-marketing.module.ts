import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentMarketingRoutingModule } from './content-marketing-routing.module';
import { ContentMarketingPageComponent } from './content-marketing-page/content-marketing-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../angular-material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { CoreModule } from '../core/core.module';
import { AddEditContentMarketingComponent } from './add-edit-content-marketing/add-edit-content-marketing.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ContentMarketingPageComponent,
    AddEditContentMarketingComponent,
  ],
  imports: [
    CommonModule,
    ContentMarketingRoutingModule,
    CoreModule,
    AngularMaterialModule,
    FlexLayoutModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContentMarketingModule {}
