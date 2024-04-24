import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { CaregiverDashboardService } from '../CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverPatientDataSource } from '../CareproviderDashboard/careprovider-patient-list/patient-list-dataSource';
import { CaregiverSharedService } from '../CareproviderDashboard/caregiver-shared.service';
import { SnackbarService } from '../core/services/snackbar.service';
import { VideoStateService } from '../twilio/services/video-state.service';

@Component({
  selector: 'app-red-zone-dialog',
  templateUrl: './red-zone-dialog.component.html',
  styleUrls: ['./red-zone-dialog.component.scss'],
})
export class RedZoneDialogComponent implements OnInit {
  public dataSource: CaregiverPatientDataSource;
  message: string;
  currentUrl: string;
  triggeredDrawers = false;
  constructor(
    private service: CaregiverDashboardService,
    public dialogRef: MatDialogRef<RedZoneDialogComponent>,
    private snackbar: SnackbarService,
    private dialogReference: MatDialog,
    public videoState: VideoStateService,
    private sharedService: CaregiverSharedService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.currentUrl = this.route.snapshot['_routerState'].url;
    this.dataSource = new CaregiverPatientDataSource(
      this.service,
      this.snackbar
    );
    this.message = localStorage.getItem('NotificationMessage');
    this.sharedService.drawerToggled.subscribe((data) => {
      if (data) {
        this.triggeredDrawers = true;
      }
    });
  }
  goToHighAlert() {
    this.dialogReference.closeAll();
    if (this.currentUrl.includes('patientProfile')) {
      this.router.navigate(['/careproviderDashboard/careprovider-patient-list']);
      localStorage.removeItem('highAlertZonePatients');
      this.dialogRef.close();
      this.sharedService.changeHighAlertPatient(true);
    } else if (this.currentUrl.includes('totalPatients')) {
      this.router.navigate(['/careproviderDashboard/careprovider-patient-list']);
      localStorage.removeItem('highAlertZonePatients');
      this.dialogRef.close();
      this.sharedService.changeHighAlertPatient(true);
    } else {
      localStorage.removeItem('highAlertZonePatients');
      this.dialogRef.close();
      this.sharedService.changeHighAlertPatient(true);
    }
    if (this.triggeredDrawers) {
      window.location.reload();
    }
  }
}
