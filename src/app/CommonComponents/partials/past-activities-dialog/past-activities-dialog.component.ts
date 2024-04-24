import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverService } from 'src/app/caregiver/caregiver.service';

@Component({
  selector: 'app-past-activities-dialog',
  templateUrl: './past-activities-dialog.component.html',
  styleUrls: ['./past-activities-dialog.component.scss'],
})
export class PastActivitiesDialogComponent implements OnInit {
  activitiesList: any = [];
  constructor(
    public dialogRef: MatDialogRef<PastActivitiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: CaregiverDashboardService
  ) {}

  ngOnInit(): void {
    this.pastActivities();
  }
  pastActivities() {
    this.service.getPastActivities(this.data.patientId).subscribe((res) => {
      this.activitiesList = res.pastActivities;
    });
  }
}
