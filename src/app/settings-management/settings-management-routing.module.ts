import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CptCodeComponent } from './cpt-code/cpt-code.component';

import { DieseaseComponent } from './disease/diesease.component';
import { SettingsManagementComponent } from './settings-management/settings-management.component';
import { SpecialityListComponent } from './speciality/speciality-list/speciality-list.component';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'ICD',
    // pathMatch: 'full',
    component: SettingsManagementComponent,
    data: {
      preload: true,
      breadcrumb: 'Settings',
      actionNameICD: 'Add ICD Code',
      actionNameSpecilitiy: 'Add Speciality',
      actionNameDoctor: 'Add Doctor Identity',
      actionNameHospital: 'Add Hospital Identity',
      title: 'Configuration',
      showActionBtn: true,
    },
  },
  {
    path: 'ICD',
    component: DieseaseComponent,
    data: {
      preload: true,
      breadcrumb: 'ICD Codes',
      actionName: 'Add ICD Code',
      title: 'ICD Codes',
      showActionBtn: true,
    },
  },

  {
    path: 'cpt',
    component: CptCodeComponent,
    data: {
      preload: true,
      breadcrumb: 'CPT-Code',
      actionName: 'Add CPT Code',
      title: 'CPT Code',
      showActionBtn: false,
    },
  },
  {
    path: 'specialty',
    component: SpecialityListComponent,
    data: {
      preload: true,
      breadcrumb: 'Specialities',
      actionName: 'Add Speciality',
      title: 'Specialities',
      showActionBtn: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsManagementRoutingModule {}
