import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogHistoryTabsComponent } from './log-history/log-history/log-history-tabs/log-history-tabs.component';
import { LogHistoryComponent } from './log-history/log-history/log-history.component';
// import { CptCodeComponent } from './cpt-code/cpt-code.component';
// import { DieseaseComponent } from './disease/diesease.component';
// import { SpecialityListComponent } from './speciality/speciality-list/speciality-list.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'log-history',
  //   pathMatch: 'full',
  // },
  {
    path: 'log-history',
    component: LogHistoryTabsComponent,
    data: {
      preload: true,
      breadcrumb: 'Log History',
      actionName: 'Add Log History',
      title: 'Reports',
      showActionBtn: false,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
