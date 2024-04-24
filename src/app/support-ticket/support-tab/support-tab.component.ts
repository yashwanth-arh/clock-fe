import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TicketTitleDialogComponent } from '../ticket-title/ticket-title-dialog/ticket-title-dialog.component';
import { TicketTitleComponent } from '../ticket-title/ticket-title.component';
import { CreatesupportticketComponent } from 'src/app/createsupportticket/createsupportticket.component';
import { SupportTicketComponent } from '../support-ticket.component';

@Component({
  selector: 'app-support-tab',
  templateUrl: './support-tab.component.html',
  styleUrls: ['./support-tab.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SupportTabComponent implements OnInit {
  selectedTabName: any = 'Support Tickets';
  @ViewChild(TicketTitleComponent) ticketTitle;
  userRole: any;

  constructor(
    private filterService: FilterSharedService,
    public entityModalPopup: MatDialog,
    public SupportTicketComponent: SupportTicketComponent
  ) {
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userRole = authDetails?.userDetails?.userRole;
  }

  ngOnInit(): void {
    this.filterService.supportTicketCall('');
    this.filterService.supportTicketSearch('');
    this.filterService.defaultTicketSearch('');
  }
  ticketTiltle1() {
    const createEntityModalConfig = new MatDialogConfig();
    createEntityModalConfig.disableClose = true;
    (createEntityModalConfig.maxWidth = '100vw'),
      (createEntityModalConfig.maxHeight = '568px'),
      (createEntityModalConfig.width = '1037px'),
      (createEntityModalConfig.data = 'add');
    this.entityModalPopup
      .open(CreatesupportticketComponent, createEntityModalConfig)
      .afterClosed()

      .subscribe((e) => {
        if (e) {
          this.filterService.statusSupport.next({ status: 'Open' });
          this.filterService.supportTicketSearch({});
          this.filterService.supportTicketCall(true);
        }
        // this.SupportTicketComponent.getSupportTicket();
      });
  }
  ticketTiltle(data) {
    const createEntityModalConfig = new MatDialogConfig();
    createEntityModalConfig.disableClose = true;
    (createEntityModalConfig.maxWidth = '100vw'),
      (createEntityModalConfig.maxHeight = '120vh'),
      (createEntityModalConfig.width = '42.5%'),
      (createEntityModalConfig.data = data);
    this.entityModalPopup
      .open(TicketTitleDialogComponent, createEntityModalConfig)
      .afterClosed()

      .subscribe((e) => {
        if (e) {
          this.filterService.statusSupport.next({ status: 'Open' });
          this.ticketTitle.getTitles();
        }
      });
  }
  getSupportTicket1(statusFilter) {
    this.filterService.supportTicketSearch('');
    this.filterService.defaultTicketSearch('');

    this.selectedTabName = statusFilter.tab.textLabel;
    this.filterService.subModuleCall(this.selectedTabName);
  }
  addDeviceType() {}
}
