import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPermission } from '../shared/entities/user-permission.enum';
import { PatientDeviceListComponent } from './patient-device/patient-device-list/patient-device-list.component';
import { PatientConsentFormComponent } from './patient-mgmt/patient-consent-form/patient-consent-form.component';
import { PatientMgmtComponent } from './patient-mgmt/patient-mgmt.component';

const routes: Routes = [
  {
    path: '',
    component: PatientMgmtComponent,
    data: {
      preload: true,
      breadcrumb: 'patient-management',
      actionName: 'Add Patient',
      title: 'Patients',
      showActionBtn: true,
      showReturnBtn: false,
      permissionAllowed: UserPermission.HAS_ENROLLMENT_PAGE,
    },
  },
  {
    path: 'consent-form/:id',
    component: PatientConsentFormComponent,
    data: {
      preload: true,
      breadcrumb: 'Patient-Consent-Form',
      actionName: 'Add Consent Form',
      title: 'Patient Consent Form',
      actionDownload: 'Download',
      showActionBtn: true,
      showReturnBtn: true,
      // permissionAllowed: UserPermission.HAS_ENROLLMENT_PAGE,
    },
  },
  {
    path: 'device',
    component: PatientDeviceListComponent,
    data: {
      preload: true,
      breadcrumb: 'Patient-device',
      actionName: 'Assign Device',
      title: 'Devices',
      // showActionBtn: true,
      showReturnBtn: true,
      permissionAllowed: UserPermission.HAS_ENROLLMENT_PAGE,
    },
  },
  {
    path: 'provider/:id',
    component: PatientMgmtComponent,
    data: {
      preload: true,
      breadcrumb: 'patient-management',
      actionName: 'Add Patient',
      title: 'Enrollments',
      showActionBtn: false,
      showReturnBtn: true,
      permissionAllowed: UserPermission.HAS_ENROLLMENT_PAGE,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientManagementRoutingModule {}
