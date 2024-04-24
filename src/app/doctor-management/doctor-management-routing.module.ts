import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPermission } from '../shared/entities/user-permission.enum';
import { DoctorComponent } from './doctor/doctor.component';

const routes: Routes = [{
  path: '',
  component: DoctorComponent,
  data: {
    preload: true,
    breadcrumb: 'Doctor-Management',
    actionName: 'Add Provider',
    title: 'Providers',
    showActionBtn: true,
    permissionAllowed: UserPermission.HAS_PROVIDER_PAGE
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorManagementRoutingModule { }
