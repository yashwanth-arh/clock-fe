import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPermission } from '../shared/entities/user-permission.enum';
import { DeviceInfoComponent } from './device-info/device-info.component';
import { DeviceModelListComponent } from './device-models/device-model-list/device-model-list.component';
import { DeviceTypeListComponent } from './device-type/device-type-list/device-type-list.component';
import { VendorsListComponent } from './vendors/vendors-list/vendors-list.component';
import { DeviceLogBookComponent } from './device-log-book/device-log-book.component';

const routes: Routes = [
  {
    path: '',
    component: DeviceInfoComponent,
    data: {
      preload: true,
      breadcrumb: 'Device-Management',
      actionName: 'Add Device',
      actionDeviceType: 'Add Device Type',
      actionDeviceModel: 'Add Device Model',
      actionDeviceVendor: 'Add Device Vendor',
      showActionBtn: 'true',
      title: 'Device Info',
      permissionAllowed: UserPermission.HAS_DEVICE_PAGE,
    },
  },
  {
    path: 'log-book',
    component: DeviceLogBookComponent,
    data: {
      preload: true,
      breadcrumb: 'log-book',
      showReturnBtn: true,
      showActionBtn: false,
      // actionName: 'vendor-list',
      title: 'Log Book',
    },
  },
  // {
  //   path: 'device-type',
  //   component: DeviceTypeListComponent,
  //   data: {
  //     preload: true,
  //     breadcrumb: 'device type list',
  //     actionName: 'Add Device type',
  //     title: 'Device types',
  //     showActionBtn: true,
  //   },
  // },
  // {
  //   path: 'device-model',
  //   component: DeviceModelListComponent,
  //   data: {
  //     preload: true,
  //     breadcrumb: 'Device Model',
  //     actionName: 'Add Device Model',
  //     title: 'Device Model',
  //     showActionBtn: true,
  //   },
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceManagementRoutingModule {}
