import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPermission } from '../shared/entities/user-permission.enum';
import { LeadershipBoardPatientComponent } from './leadership-board-patient/leadership-board-patient.component';
import { LeadershipBoardComponent } from './leadership-board.component';

const routes: Routes = [
  {
    path: '',
    component: LeadershipBoardComponent,
    data: {
      preload: true,
      breadcrumb: 'leadership-board',
      actionName: 'leadership-board',
      title: 'Leader Board',
      showActionBtn: false,
      showReturnBtn: false,
      permissionAllowed: UserPermission.HAS_HOSPITAL_PAGE,
    },
  },
  {
    path: ':id',
    component: LeadershipBoardPatientComponent,
    data: {
      preload: true,
      breadcrumb: 'leadership-board',
      actionName: 'leadership-board',
      title: 'Leader Points Board',
      showActionBtn: false,
      showReturnBtn: true,
      permissionAllowed: UserPermission.HAS_HOSPITAL_PAGE,
    },
  },
  //   {
  //     path: 'users',
  //     component: hospitalUserComponent,
  //     data: {
  //       preload: true,
  //       breadcrumb: 'hospital-user',
  //       actionName: 'Add Admin',
  //       title: 'Admins',
  //       showActionBtn: true,
  //       showReturnBtn: true,
  //       permissionAllowed: UserPermission.HAS_HOSPITAL_PAGE,
  //     },
  //   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadershipBoardRoutingModule {}
