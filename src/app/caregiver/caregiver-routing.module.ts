import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPermission } from '../shared/entities/user-permission.enum';
import { CaregiverComponent } from './caregiver.component';

const routes: Routes = [{
  path: '',
  component: CaregiverComponent,
  data: {
    preload: true,
    breadcrumb: 'Caregiver',
    actionName: 'Add Caregiver',
    title: 'Caregivers',
    showActionBtn: true,
    permissionAllowed: UserPermission.HAS_CAREGIVER_PAGE
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaregiverRoutingModule { }
