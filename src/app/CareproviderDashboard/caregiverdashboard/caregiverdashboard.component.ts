import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { Router } from '@angular/router';

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CaregiverDashboardService } from '../caregiver-dashboard.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-caregiverdashboard',
  templateUrl: './caregiverdashboard.component.html',
  styleUrls: ['./caregiverdashboard.component.scss'],
})
export class CaregiverdashboardComponent implements OnInit {
  roleid: any;
  details: any = [];
  username: string;
  branch: string;
  userRole: any;
  userId: string;
  countNotification: string;
  triggeredNotification: boolean;
  @ViewChild('drawer') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private auth: AuthService,
    public service: CaregiverDashboardService,
    private caregiverSharedService: CaregiverSharedService,
    public router: Router
  ) {
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
    this.username = localStorage.getItem('currentUserName');
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.caregiverSharedService.triggeredNotificationCount.subscribe(
      (value) => {
        this.triggeredNotification = value;
        if (this.triggeredNotification) {
          this.caregiverSharedService.changeTabCounts(true);
          this.notificationCount();
        } else {
          this.caregiverSharedService.changeTabCounts(true);
          this.notificationCount();
        }
      }
    );
  }

  notificationCount() {
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userId = authDetails?.userDetails?.scopeId;
    this.service?.getNotificationCount().subscribe(
      (res) => {
        this.countNotification = res.content;
      },
      (err) => {
        if (err.status == 401) {
          this.router.navigate(['/login']);
        }
        // else this.snackbarService.error(err.error.message);
      }
    );
  }
  getUpdatedCount(event) {
    this.userId = localStorage.getItem('currentUserId');
    if (event) {
      this.notificationCount();
    }
  }
}
