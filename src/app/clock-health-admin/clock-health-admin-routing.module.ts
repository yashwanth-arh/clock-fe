import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPermission } from '../shared/entities/user-permission.enum';
import { ClockHealthAdminComponent } from './clock-health-admin.component';

const routes: Routes = [{
  path: '',
  component: ClockHealthAdminComponent,
  data: {
    preload: true,
    breadcrumb: 'Clock Health',
    actionName: 'Add Admin',
    title: 'ClockHealth Admins',
    showActionBtn: true,
    permissionAllowed: UserPermission.HAS_PROVIDER_PAGE
  },
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClockHealthAdminRoutingModule { }
