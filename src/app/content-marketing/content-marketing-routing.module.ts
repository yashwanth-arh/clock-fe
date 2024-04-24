import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPermission } from '../shared/entities/user-permission.enum';
import { ContentMarketingPageComponent } from './content-marketing-page/content-marketing-page.component';

const routes: Routes = [
  {
    path: '',
    component: ContentMarketingPageComponent,
    data: {
      preload: true,
      breadcrumb: 'content-marketing',
      title: 'Content Marketing',
      actionName: 'Add New Content',
      showActionBtn: true,
      showReturnBtn: false,
      // permissionAllowed: UserPermission.HAS_HOSPITAL_PAGE,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentMarketingRoutingModule {}
