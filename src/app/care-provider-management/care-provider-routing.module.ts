import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPermission } from '../shared/entities/user-permission.enum';
import { CareProviderMasterComponent } from './care-provider-master/care-provider-master.component';
import { CareProviderComponent } from './care-provider/care-provider.component';
import { CareCoordinatorComponent } from './care-coordinator/care-coordinator.component';

const routes: Routes = [
  {
    path: '',
    component: CareProviderMasterComponent,
    data: {
      preload: true,
      breadcrumb: 'Doctor-Management',
      actionName: 'Add Care Provider',
      actionCoordinator: 'Add Care Coordinator',
      title: 'Users',
      showActionBtn: true,
      permissionAllowed: UserPermission.HAS_PROVIDER_PAGE,
    },
  },
  {
    path: 'users',
    component: CareProviderComponent,
    data: {
      preload: true,
      breadcrumb: 'Doctor-Management',
      actionName: 'Add Care Provider',
      actionCoordinator: 'Add Care Coordinator',
      title: 'Care Provider',
      showActionBtn: true,
      permissionAllowed: UserPermission.HAS_PROVIDER_PAGE,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CareProviderManagementRoutingModule {}
