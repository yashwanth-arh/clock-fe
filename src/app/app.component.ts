import { CaregiverSharedService } from './CareproviderDashboard/caregiver-shared.service';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { SnackbarService } from './core/services/snackbar.service';
import { Keepalive } from '@ng-idle/keepalive';
import { filter, shareReplay, take } from 'rxjs/operators';
import { PushNotificationService } from './Firebase Service/push-notification.service';
// import { ApiTimeoutService } from './core/services/api-timeout.service';
import { Subscription } from 'rxjs';
// import { shareReplay, take } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TimeoutNotificationComponent } from './partials/timeout-notification/timeout-notification.component';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './core/services/auth.service';
import { TimeoutDialogComponent } from './timeout-dialog/timeout-dialog.component';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { User } from './shared/models/user.model';
import { CaregiverPatientDataSource } from './CareproviderDashboard/careprovider-patient-list/patient-list-dataSource';
import { CaregiverDashboardService } from './CareproviderDashboard/caregiver-dashboard.service';
import { RedZoneDialogComponent } from './red-zone-dialog/red-zone-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'CHC-FE';
  hide = false;
  lastPing?: Date = null;
  idleState = 'Not started.';
  timedOut = false;
  userId: string;
  @Output() notificationCountTrigger = new EventEmitter<boolean>();
  private timeoutSubscription: Subscription;
  userRole: any;

  constructor(
    public pushNotificationService: PushNotificationService,
    private sharedService: CaregiverSharedService,
    private snackbar: SnackbarService,
    private authService: AuthService,
    private keepalive: Keepalive,
    public idle: Idle,
    public dialog: MatDialog,
    public matDialog: MatDialog,
    private router: Router
  ) {
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userRole = authDetails?.userDetails?.userRole;
    this.userId = authDetails?.userDetails?.scopeId;
    this.authService.user.subscribe((user: User) => {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((res: NavigationEnd) => {
          if (localStorage.getItem('url')) {
            localStorage.setItem('url', localStorage.getItem('url'));
            sessionStorage.setItem('url', sessionStorage.getItem('url'));
          } else {
            sessionStorage.setItem('url', res.url);
            localStorage.setItem('url', res.url);
          }
        });
    });
    idle.setIdle(environment.idle_time);
    idle.setTimeout(10);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.matDialog.closeAll();
      this.reset();
    });

    idle.onIdleStart.subscribe(() => {
      const url = sessionStorage.getItem('url');
      this.idleState = "You've gone idle!";
      if (url !== '/login') {
        if (url !== '/forgot-password') {
          const timeoutModal = this.matDialog.open(TimeoutDialogComponent, {
            closeOnNavigation: false,
            hasBackdrop: false,
            disableClose: true,
            width: '30%',
            height: '150px',
            data: {
              timeout: 10,
            },
          });
          idle.onTimeout.subscribe(() => {
            this.timedOut = true;
            this.authService.logout();
            this.reset();
          });
        }
      }
    });

    this.keepalive.interval(15);
    this.keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.reset();
  }

  reset(): void {
    this.idle.watch();
    this.idleState = 'Started';
    this.timedOut = false;
    this.matDialog.closeAll();
  }

  ngOnInit(): void {
    this.idle.watch();
    this.pushNotificationService.requestPermission();
    this.pushNotificationService.receiveMessage();
    this.pushNotificationService.currentMessage.subscribe((msg) => {
      if (msg) {
        this.notificationCountTrigger.emit(true);
        const msgBody =
          msg.notification && msg.notification.body
            ? msg.notification.body
            : '';
        const msgTitle =
          msg.notification && msg.notification.title
            ? msg.notification.title
            : '';
        if (msgTitle === 'High Alert') {
          this.sharedService.changeCaregiverHighAlertPatient(true);
          localStorage.setItem('NotificationMessage', msgBody);
          const authDetails = JSON.parse(localStorage.getItem('auth'));
          this.userRole = authDetails?.userDetails?.userRole;
          if (this.userRole === 'DOCTOR') {
            this.openRedZoneDialog();
          }
          // this.dataSource.loadPatients(1, 0);
          // this.sharedService.changeHighAlertPatient(true);
        }
        this.snackbar.showMultiline(msgTitle, msgBody, 3000);
        this.sharedService.changeCount(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.timeoutSubscription.unsubscribe();
  }
  openRedZoneDialog() {
    const dialogRef = this.dialog.open(RedZoneDialogComponent, {
      width: '400px',
      height: '150px',
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {});
  }
  openTimeoutAlert(): void {
    const alertOptions: MatDialogConfig = {
      disableClose: true,
      hasBackdrop: true,
      width: '20%',
    };
    const dialogRef = this.matDialog.open(
      TimeoutNotificationComponent,
      alertOptions
    );
  }
}
