import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SidenavService } from './../../core/services/sidenav.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { PushNotificationService } from 'src/app/Firebase Service/push-notification.service';
import { NotifierService } from 'angular-notifier';
import { HeaderComponent } from 'src/app/navigation/header/header.component';
import { SettingsStateService } from 'src/app/core/services/settings-state.service';
import { DashbaordStateService } from '../doctor-patients-details/dashbaord-state.service';
import { MediaObserver } from '@angular/flex-layout';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogService } from 'src/app/services/mat-dialog.service';
import { DoctorDashboardService } from 'src/app/doctor-dashboard/doctor-dashboard.service';
import { ImgUploadService } from 'src/app/core/components/image-upload/img-upload.service';
import { CallScheduleComponent } from '../call-schedule/call-schedule.component';

@Component({
  selector: 'app-call-scheduler',
  templateUrl: './call-scheduler.component.html',
  styleUrls: ['./call-scheduler.component.scss'],
})
export class CallSchedulerComponent implements OnInit {
  dateInput: Date;
  roleid: string;
  userRole: string;
  details: any = [];
  username: string;
  branch: string;
  userId: string;
  maxDate: Date = new Date();
  callType: string;
  isSubmitted = false;
  scheduleCallForm: FormGroup;
  loadRes = false;
  checkedUser = true;
  minDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    new Date().getHours(),
    new Date().getMinutes() + 15
  );
  @ViewChild(CallScheduleComponent)
  scheduledCallComponent!: CallScheduleComponent;

  constructor(
    public dialogRef: MatDialogRef<CallSchedulerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private caregiverDashboardService: CaregiverDashboardService,
    private caregiverSharedService: CaregiverSharedService,
    public dialog: MatDialog,
    private auth: AuthService,
    private snackbarService: SnackbarService,
    public datepipe: DatePipe,
    private router: Router,
    private fb: FormBuilder
  ) {
    const user = this.auth?.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
    
    this.userId = localStorage.getItem('currentUserId');
    this.username = localStorage.getItem('currentUserName');
  }

  ngOnInit(): void {
    const coeff = 1000 * 60 * 5;
    const date = new Date(); //or use any other date
    if (!this.data) {
      this.maxDate = new Date(Math.round(date.getTime() / coeff) * coeff);
    } else {
      this.maxDate = new Date(
        Math.round(new Date(this.data.scheduleDate).getTime() / coeff) * coeff
      );
    }

    if (this.data.uniqueKey === 'scheduleVoice') {
      this.callType = 'SCHEDULE_VOICECALL';
    } else {
      this.callType = 'SCHEDULE_VIDEOCALL';
    }
    this.scheduleCallForm = this.fb.group({
      scheduleDate: ['', Validators.required],
    });
  }
  checkValue(evt) {
    this.checkedUser = evt.checked;
  }
  scheduleCall() {
    this.loadRes = true;
    if (
      this.scheduleCallForm.get('scheduleDate').value === null ||
      this.scheduleCallForm.get('scheduleDate').value === ''
    ) {
      // alert("Enter valid Date & Time");
      this.loadRes = false;
      return;
    }
    this.isSubmitted = true;
    // var scheduledate = this.caregiverSharedService.formatDate(this.scheduleCallForm.get('scheduleDate').value);
    // var scheduletime = new Date(this.scheduleCallForm.get('scheduleDate').value).toTimeString();

    if (!this.data.uniqueValue) {
      const body = {
        senderName: this.username,
        senderId: this.userId,
        callType: this.callType,
        scheduledBy: 'CAREPROVIDER',
        scheduleCallStatus: 'INITIATED',

        // scheduleDate: new Date(this.dateInput.setHours(5, 29, 0, 0)).toISOString()
      };
      let d = this.scheduleCallForm.get('scheduleDate').value;
      d.setHours(
        this.scheduleCallForm.get('scheduleDate').value.getHours() + 5
      );
      d.setMinutes(
        this.scheduleCallForm.get('scheduleDate').value.getMinutes() + 30
      );
      body['scheduleDate'] = new Date(d);

      if (this.data.element) {
        body['patientName'] =
          this.data.element.firstName + ' ' + this.data.element.lastName;
        body['receiverId'] = this.data.element.scopeId;
      }
      // else {
      //   body['patientName'] = this.data.element.responsePt.firstName + ' ' + this.data.element.responsePt.lastName;
      //   body['receiver'] = this.data.element.responsePt.id;
      // }

      this.caregiverDashboardService.startCall(body).subscribe(
        () => {
          this.isSubmitted = false;
          this.loadRes = false;
          this.snackbarService.success('Call scheduled successfully');
          this.caregiverSharedService.changeScheduleCallCount(true);
          this.dialogRef.close(true);
        },
        (err) => {
          if (err.status == 401) {
            this.router.navigate(['/login']);
          }
          // this.snackbarService.error(err.message);
          this.loadRes = false;
          this.dialogRef.close();
        }
      );
    } else {
      const body = {
        scheduleDate: new Date(this.scheduleCallForm.get('scheduleDate').value),
        senderName: this.username,
        patientName: this.data.patientName,
        receiverId: this.data.receiverId,
        senderId: this.userId,
        callType: this.callType,
        scheduledBy: 'CAREPROVIDER',
        scheduleCallStatus: 'INITIATED',
      };
      let d = this.scheduleCallForm.get('scheduleDate').value;
      d.setHours(
        this.scheduleCallForm.get('scheduleDate').value.getHours() + 5
      );
      d.setMinutes(
        this.scheduleCallForm.get('scheduleDate').value.getMinutes() + 30
      );
      body['scheduleDate'] = new Date(d);
      this.caregiverDashboardService
        .rescheduleCall(this.data.id, body)
        .subscribe(
          () => {
            this.loadRes = false;
            this.isSubmitted = false;
            this.snackbarService.success('Call rescheduled successfully');
            this.dialogRef.close(true);
            this.scheduledCallComponent.getScheduledCallList(
              'INITIATED',
              0,
              100
            );
          },
          (err) => {
            if (err.status == 401) {
              this.router.navigate(['/login']);
            }
            // this.snackbarService.error(err.message);
            this.loadRes = false;
            this.dialogRef.close();
          }
        );
    }
  }
}
