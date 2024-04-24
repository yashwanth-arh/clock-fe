import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchUserListComponent } from '../branch-user/branch-user-list/branch-user-list.component';
import { BranchListComponent } from './branch-list/branch-list.component';

const routes: Routes = [
  {
    path: '',
    component: BranchListComponent,
    data: {
      preload: true,
      breadcrumb: 'Facilities',
      actionName: 'Add Facility',
      title: 'Facilities',
      showActionBtn: true,
    },
  },

  {
    path: 'users',
    component: BranchUserListComponent,
    data: {
      preload: true,
      breadcrumb: 'Admins',
      actionName: 'Add Admin',
      title: 'Facility Admin',
      showActionBtn: true,
      showReturnBtn: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BranchRoutingModule {}
