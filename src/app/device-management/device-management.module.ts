import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DeviceComponent } from './device/device.component';
import { AddEditDeviceComponent } from './device/add-edit-device/add-edit-device.component';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from '../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DeviceManagementRoutingModule } from './device-management-routing.module';
import { AssignDeviceComponent } from './device/assign-device/assign-device.component';
import { DeviceInfoComponent } from './device-info/device-info.component';
import { DeviceTypeListComponent } from './device-type/device-type-list/device-type-list.component';
import { DeviceTypeAddComponent } from './device-type/device-type-add/device-type-add.component';
import { DeviceTypeEditComponent } from './device-type/device-type-edit/device-type-edit.component';
import { DeviceModelListComponent } from './device-models/device-model-list/device-model-list.component';
import { DeviceModelDialogComponent } from './device-models/device-model-dialog/device-model-dialog.component';
import { VendorsListComponent } from './vendors/vendors-list/vendors-list.component';
import { AddVendorsComponent } from './vendors/add-vendors/add-vendors.component';
import { DeviceLogBookComponent } from './device-log-book/device-log-book.component';

@NgModule({
  declarations: [
    DeviceComponent,
    AddEditDeviceComponent,
    AssignDeviceComponent,
    DeviceInfoComponent,
    DeviceTypeListComponent,
    DeviceTypeAddComponent,
    DeviceTypeEditComponent,
    DeviceModelListComponent,
    DeviceModelDialogComponent,
    VendorsListComponent,
    AddVendorsComponent,
    DeviceLogBookComponent
  ],
  imports: [
    CommonModule,
    DeviceManagementRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    LayoutModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
  ],
})
export class DeviceManagementModule {}
