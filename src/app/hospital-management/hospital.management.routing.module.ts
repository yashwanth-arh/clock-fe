import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HospitalComponent } from './hospital/hospital.component';
import { HospitalUserComponent } from './hospital-user/hospital-user.component';
import { UserPermission } from '../shared/entities/user-permission.enum';
import { HospitalClinicComponent } from './hospital-clinic/hospital-clinic.component';
import { ViewDevicesComponent } from './view-devices/view-devices.component';

const routes: Routes = [
  {
    path: '',
    component: HospitalComponent,
    data: {
      preload: true,
      breadcrumb: 'hospital-management',
      actionName: 'Add Hospital',
      title: 'Hospitals',
      showActionBtn: true,
      permissionAllowed: UserPermission.HAS_HOSPITAL_PAGE,
    },
  },
  {
    path: 'users',
    component: HospitalUserComponent,
    data: {
      preload: true,
      breadcrumb: 'hospital-user',
      actionName: 'Add Admin',
      title: 'Hospital Admin',
      showActionBtn: true,
      showReturnBtn: true,
      permissionAllowed: UserPermission.HAS_HOSPITAL_PAGE,
    },
  },
  {
    path: 'facilities',
    component: HospitalClinicComponent,
    data: {
      preload: true,
      breadcrumb: 'hospital-clinic',
      actionName: 'Add Clinic',
      title: 'Facilities',
      showActionBtn: false,
      showReturnBtn: true,
      permissionAllowed: UserPermission.HAS_HOSPITAL_PAGE,
    },
  },
  {
    path: 'devices',
    component: ViewDevicesComponent,
    data: {
      preload: true,
      breadcrumb: 'devices-history',
      // actionName: 'Assign Device',
      title: 'Devices',
      // showActionBtn: true,
      showReturnBtn: true,
      permissionAllowed: UserPermission.HAS_HOSPITAL_PAGE,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class hospitalManagementRoutingModule {}
