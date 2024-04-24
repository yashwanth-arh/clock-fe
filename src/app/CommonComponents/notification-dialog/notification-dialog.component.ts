import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from './../../core/services/snackbar.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { environment } from 'src/environments/environment';
import { MatDialogService } from 'src/app/services/mat-dialog.service';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss'],
})
export class NotificationDialogComponent implements OnInit {
  roleid: any;
  userRole: any;
  notifications: any;
  details: any;
  userId: string;
  username: string;
  doctorId: string;
  drawer: MatDrawer;
  statusText: string;
  showApptModule: boolean;
  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private service: CaregiverDashboardService,
    private auth: AuthService,
    private snackbarService: SnackbarService,
    public sharedService: CaregiverSharedService,
    private router: Router,
    private route: ActivatedRoute,
    private matDilaogService: MatDialogService
  ) {
    //

    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userId = authDetails?.userDetails?.scopeId;
    this.username = localStorage.getItem('currentUserName');
    this.showApptModule = environment.appointment;
  }

  ngOnInit(): void {
    this.notificationList();
  }

  clearAll() {
    // this.matDilaogService.closeDialog(this.dialogRef);
    this.service.clearAllNotifications().subscribe(
      (res) => {
        this.notifications = [];
        this.sharedService.changeCount(true);
      },
      (err) => {
        this.snackbarService.error(err.error.message);
      }
    );
  }
  notificationList() {
    this.service.getNotifications().subscribe(
      (res) => {
        if (res) {
          this.notifications = res?.['content'];
          // if (this.notifications.length == 0 || this.notifications == null) {
          //   this.statusText = "No Notifications Available"
          // }
        }
      },
      (err) => {
        // this.snackbarService.error(err.message);
      }
    );
  }
  viewNotification(data) {
    const body = {
      seenTime: new Date(),
    };
    this.service.seenNotification(data.id, body).subscribe(
      () => {
        this.snackbarService.success('Notification seen');
        this.notificationList();
        localStorage.removeItem('patientId');
        localStorage.setItem('patientId', data.patientId);
        if (
          this.route['_routerState'].snapshot.url ==
          '/careproviderDashboard/patientProfile'
        ) {
          this.dialogRef.close(true);
          location.reload();
        } else {
          this.dialogRef.close(true);
          this.router.navigate(['/careproviderDashboard/patientProfile']);
        }
        // if (this.userRole == 'CAREGIVER') {
        //   localStorage.removeItem('patientId');
        //   localStorage.setItem('patientId', data.patientId);
        //   if (data.type == 19 || data.type == 20) {
        //     this.sharedService.triggerdMatdrawer.subscribe((value) => {
        //       if (value) {
        //         value.toggle();
        //       }
        //     });
        //   } else if (
        //     this.route['_routerState'].snapshot.url ==
        //     '/caregiverDashboard/patientProfile'
        //   ) {
        //     location.reload();
        //   } else {
        //     this.router.navigate(['/caregiverDashboard/patientProfile']);
        //   }
        //   // this.matDilaogService.closeDialog(this.dialogRef);
        //   this.snackbarService.success('Notification seen');
        // } else {
        //   localStorage.removeItem('patientId');
        //   localStorage.setItem('patientId', data.patientId);
        //   if (
        //     this.route['_routerState'].snapshot.url ==
        //     '/careproviderDashboard/patientProfile'
        //   ) {
        //     location.reload();
        //   }
        //   this.router.navigate(['/careproviderDashboard/patientProfile']);
        //   this.dialogRef.close(true);
        //   this.snackbarService.success('Notification seen');
        // }
        this.sharedService.changeCount(true);
      },
      (err) => {
        this.snackbarService.error(err.error.message);
      }
    );
  }
}
