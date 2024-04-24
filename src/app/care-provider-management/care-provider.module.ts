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
import { CareProviderManagementRoutingModule } from './care-provider-routing.module';
import { CareProviderDialogComponent } from './care-provider-dialog/care-provider-dialog.component';
import { CareProviderComponent } from './care-provider/care-provider.component';
import { CareProviderMasterComponent } from './care-provider-master/care-provider-master.component';
import { CareCoordinatorComponent } from './care-coordinator/care-coordinator.component';
import { CareCoordinatorDialogComponent } from './care-coordinator-dialog/care-coordinator-dialog.component';
import { SharedModule } from '../branches/shareModule..module';
import { CareproviderMyTeamsComponent } from './careprovider-my-teams/careprovider-my-teams.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    CareProviderComponent,
    CareProviderDialogComponent,
    CareProviderMasterComponent,
    CareCoordinatorComponent,
    CareCoordinatorDialogComponent,
    CareproviderMyTeamsComponent,
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
    SharedModule,
    NgxMaskModule.forRoot(maskConfig),
    MatMenuModule,
    MatButtonModule
  ],
})
export class CareProviderManagementModule {}
