import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPermission } from '../shared/entities/user-permission.enum';
import { SupportTabComponent } from './support-tab/support-tab.component';
import { SupportTicketComponent } from './support-ticket.component';
import { TicketTitleComponent } from './ticket-title/ticket-title.component';

const routes: Routes = [
  {
    path: '',
    component: SupportTabComponent,
    data: {
      preload: true,
      breadcrumb: 'support-ticket',
      title: 'Tickets',
      actionName: 'New Ticket',
      showActionBtn: true,
      showReturnBtn: false,
    },
  },
  {
    path: 'ticket-title',
    component: TicketTitleComponent,
    data: {
      preload: true,
      breadcrumb: 'ticket-title',
      title: 'Default Issue',
      actionName: 'New Default Issue',
      showActionBtn: true,
      showReturnBtn: true,
    },
  },
  {
    path: 'support_ticket',
    component: SupportTicketComponent,
    data: {
      preload: true,
      breadcrumb: 'support_ticket',
      title: 'Support-Ticket',
      actionName: 'New Default Issue',
      showActionBtn: true,
      showReturnBtn: true,
    },
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportTicketRoutingModule { }
