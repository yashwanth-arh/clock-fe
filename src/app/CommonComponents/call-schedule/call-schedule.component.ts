import { AuthService } from './../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { merge } from 'rxjs';
import { CallSchedulerComponent } from 'src/app/CommonComponents/call-scheduler/call-scheduler.component';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { MatDrawer } from '@angular/material/sidenav';
import { tap } from 'rxjs/operators';

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { VideoCallComponent } from 'src/app/twilio/video-call/video-call.component';
import { AudioCallComponent } from 'src/app/twilio/audio-call/audio-call.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ParticipantsComponent } from 'src/app/twilio/participants/participants.component';
import { Room } from 'twilio-video';
import { TimerComponent } from 'src/app/core/components/timer/timer.component';
@Component({
  selector: 'app-call-schedule',
  templateUrl: './call-schedule.component.html',
  styleUrls: ['./call-schedule.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CallScheduleComponent implements OnInit, AfterViewInit {
  @Input() drawerToggle: MatDrawer;
  @Input() scheduleCall: any[];
  @Output() searchedScheduledData = new EventEmitter();
  // @Output() countScheduleCall = new EventEmitter();
  @ViewChild('participants') participants: ParticipantsComponent;
  public activeRoom: Room;
  selectedTabIdx: number;
  dataSource: any;
  @ViewChild('timer') timer: TimerComponent;
  loadRes: boolean = true;
  scheduledId: string;
  callEndType: string;
  triggerCall = false;
  userId: string;
  username: string;
  scheduleCallId: string;
  searchData: string;
  scheduledCallDataSource: any;
  scheduleDate: Date;
  callp = 1;
  size = 5;
  callpc = 1;
  sizec = 5;
  pageIndex = 0;
  pageSize = 10;
  sizecancel = 5;
  callpcancel = 1;
  details: any = [];
  branch: string;
  userRole: string;
  roleid: string;
  showSearchCloseIcon = false;
  selectedTabName: string = 'INITIATED';
  displayedColumns: string[] = [
    'patientName',
    'contactNumber',
    'scheduledDate',
    // 'scheduledTime',
    // 'phoneNo',
    'duration',
    'status',
    'action',
  ];
  displayedColumnsCancelled: string[] = [
    'patientName',
    'contactNumber',
    'scheduledDate',
    // 'scheduledTime',
    // 'phoneNo',
    'duration',
    'status',
  ];
  filteredSchedulebyStatus: any = [];
  initiatedData: any = [];
  showDatePicker = true;
  status: string = 'INITIATED';
  @Output() disableOverlay = new EventEmitter();
  @Output() cancelledCall = new EventEmitter();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table', { read: ElementRef }) table: ElementRef;
  osType: string;
  pageEvent: PageEvent;
  length: number;
  user: any;
  constructor(
    public service: CaregiverDashboardService,
    private auth: AuthService,
    public snackbarService: SnackbarService,
    public dialog: MatDialog,
    public caregiverSharedService: CaregiverSharedService,
    public datepipe: DatePipe
  ) {
    this.scheduleDate = new Date();
    this.user = this.auth.authData;
    this.roleid = this.user?.userDetails?.id;
    this.userRole = this.user?.userDetails?.userRole;
    this.userId = this.user?.userDetails?.id;
    this.username =
      this.user?.userDetails['firstName'] +
      ' ' +
      this.user?.userDetails['lastName'];
  }

  ngOnInit(): void {
    this.osType = window.navigator.platform;
    this.caregiverSharedService.triggeredScheduleCallDrawer.subscribe((res) => {
      if (res) {
        this.selectedTabIdx = 0;
        this.getScheduledCallList(this.status, this.pageIndex, this.pageSize);
        this.selectedTabName = 'INITIATED';
      }
    });
    // this.caregiverSharedService.changeScheduleCallDrawer
  }
  // var result = users.filter(({user}) => user === 'barney' || user === "fred");
  ngAfterViewInit() {}
  drawerToggleClose() {
    this.showSearchCloseIcon = false;
    this.searchData = '';
    this.scheduleDate = new Date();
    this.drawerToggle.toggle();
    this.disableOverlay.emit(true);
    this.caregiverSharedService.changeDrawerToggled(true);
    this.caregiverSharedService.changeScheduleCallDrawer(false);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getScheduledCallList(
      this.selectedTabName,
      this.pageIndex,
      this.pageSize
    );
  }
  getBySearchParams() {
    const regExp = /[a-zA-Z]/g;
    const testString = this.searchData;

    if (regExp.test(testString)) {
      if (testString?.length > 2) {
        this.scheduledCallDataSource = [];
        this.loadRes = true;
        this.service
          .searchScheduleCallList(
            testString,
            this.caregiverSharedService.formatDate(this.scheduleDate),
            this.selectedTabName,
            this.pageIndex,
            this.pageSize
          )
          .subscribe(
            (data) => {
              this.loadRes = false;
              this.dataSource = data;
              this.scheduleCall = data['content'];
              this.scheduledCallDataSource = this.scheduleCall;
              // this.showDatePicker = false;
              this.showSearchCloseIcon = true;
            },
            (err) => {
              // this.snackbarService.error(err.error.message);
            }
          );
      }
    } else {
      if (!testString.length) {
        this.showSearchCloseIcon = false;
        this.searchData = '';
        this.searchedScheduledData.emit(true);
        this.showDatePicker = true;
        this.getScheduledCallList(this.selectedTabName, 0, 10);
      } else {
        this.snackbarService.error('Enter valid text');
        this.showSearchCloseIcon = false;
      }
    }
  }
  clearSearch() {
    this.showSearchCloseIcon = false;
    this.searchData = '';
    this.getScheduledCallList(this.selectedTabName, 0, 10);
  }
  tabChanged(event) {
    this.loadRes = true;
    this.pageIndex = 0;
    if (event.index === 0) {
      this.selectedTabName = 'INITIATED';
      this.selectedTabIdx = event.index;
      this.searchData = '';
      this.showSearchCloseIcon = false;
      this.getScheduledCallList('INITIATED', 0, 10);
    } else if (event.index === 1) {
      this.selectedTabName = 'COMPLETED';
      this.selectedTabIdx = event.index;
      this.searchData = '';
      this.showSearchCloseIcon = false;
      this.getScheduledCallList('COMPLETED', 0, 10);
    } else if (event.index === 2) {
      this.selectedTabName = 'CANCELLED';
      this.selectedTabIdx = event.index;
      this.searchData = '';
      this.showSearchCloseIcon = false;
      this.getScheduledCallList('CANCELLED', 0, 10);
    }
  }
  getScheduledCallList(status, page, size) {
    this.scheduledCallDataSource = [];
    this.service
      .filterScheduleCallByDate(
        this.caregiverSharedService.formatDate(this.scheduleDate),
        status,
        page,
        size
      )
      .subscribe(
        (res) => {
          this.loadRes = false;
          this.dataSource = res;
          this.scheduleCall = res['content'];
          this.scheduledCallDataSource = this.scheduleCall;
        },
        (err) => {
          this.loadRes = false;
          this.snackbarService.error(err.message);
        }
      );
  }
  changeEvent(evt) {
    this.loadRes = true;
    this.scheduleDate = evt;
    this.getScheduledCallList(
      this.selectedTabName,
      this.pageIndex,
      this.pageSize
    );
  }

  cancelCall(ele) {
    this.service.cancelCall(ele.id).subscribe(
      () => {
        this.snackbarService.success('Call cancelled successfully');
        this.cancelledCall.emit(true);
        this.getScheduledCallList('INITIATED', this.pageIndex, this.pageSize);
      },
      (err) => {
        // this.snackbarService.error(err.error.message);
      }
    );
  }

  rescheduleCallDialog(ele, text) {
    ele['uniqueValue'] = text;
    ele['uniqueKey'] = ele.callType;
    const scheduleCallModalConfig = new MatDialogConfig();
    scheduleCallModalConfig.disableClose = true;
    (scheduleCallModalConfig.maxWidth = '412px'),
      (scheduleCallModalConfig.maxHeight = '250px'),
      (scheduleCallModalConfig.height = '250px'),
      (scheduleCallModalConfig.width = '412px'),
      (scheduleCallModalConfig.data = ele);

    this.dialog
      .open(CallSchedulerComponent, scheduleCallModalConfig)
      .afterClosed()
      .subscribe((e) => {
        if (e) {
          this.getScheduledCallList('INITIATED', this.pageIndex, this.pageSize);
        }
      });
  }
  isDisable(ele) {
    const currentDate = new Date();
    this.getFormattedDate(ele.scheduleDate);
    const scheduledDate = new Date(this.getFormattedDate(ele.scheduleDate));
    const maxDate = new Date(this.getFormattedDate(ele.scheduleDate));
    maxDate.setMinutes(maxDate.getMinutes() + 30);
    if (
      currentDate >= scheduledDate &&
      currentDate < maxDate &&
      ele.scheduleCallStatus !== 'COMPLETED'
    ) {
      return false;
    } else {
      return true;
    }
  }
  isDisableReschedule(date) {
    const currentDate = new Date();
    const scheduledDate = new Date(this.getFormattedDate(date));
    // var maxDate = new Date(date);
    // maxDate.setHours(maxDate.getHours() + 0.5);
    if (currentDate > scheduledDate) {
      return true;
    } else {
      return false;
    }
  }
  getStatus(ele) {
    const currentDate = new Date();
    const maxDate = new Date(this.getFormattedDate(ele.scheduleDate));
    maxDate.setMinutes(maxDate.getMinutes() + 40);
    if (
      (currentDate > maxDate && ele.scheduleCallStatus === 'INITIATED') ||
      (ele.callState === 'IMMEDIATE' &&
        ele.scheduleCallStatus === 'INITIATED' &&
        ele.recieverCallduration === null)
    ) {
      return true;
    } else {
      return false;
    }
  }
  cancelSearch() {
    this.showSearchCloseIcon = false;
    this.searchData = '';
    this.searchedScheduledData.emit(true);
    // this.showDatePicker = true;
  }
  getFormattedDate(date) {
    if (date) {
      let sDateTime = date.split('T');
      let sTime = sDateTime[1].split(':');
      let sDate = sDateTime[0].split('-');

      return (
        sDate[0] +
        '/' +
        sDate[1] +
        '/' +
        sDate[2] +
        ' ' +
        sTime[0] +
        ':' +
        sTime[1]
      );
    } else {
      return '';
    }
  }

  startVideoCall(ele): void {
    this.userId = this.user?.userDetails?.id;
    this.username =
      this.user?.userDetails['firstName'] +
      ' ' +
      this.user?.userDetails['lastName'];

    if (
      this.username == undefined ||
      this.username == null ||
      this.username == ''
    ) {
      return;
    }
    const callType = 'SCHEDULE_VIDEOCALL';
    const body = {
      patientName: ele.patientName,
      senderName: this.username,
      sender: this.userId,
      receiver: ele.receiver,
      callType: callType,
      scheduleDate: new Date().toUTCString(),
      call: 'ATTEND',
      scheduledBy: 'null',
      scheduleCallStatus: 'INPROGRESS',
    };
    // this.service.immediateCall(body).subscribe(
    //   (res) => {
    // this.scheduleCallId = res.id;
    this.service.setCallStarted(ele.id).subscribe(
      (res) => {
        this.scheduleCallId = ele.id;
        localStorage.setItem('scheduledid', this.scheduleCallId);
        localStorage.setItem('callEndType', 'SCHEDULE_CALL');
        const dialogConfig: MatDialogConfig = {
          disableClose: true,
          closeOnNavigation: false,
          hasBackdrop: false,
          maxWidth: '1726px',
          maxHeight: '100vh',
          height: '92vh',
          width: '60%',
          panelClass: 'video-call-container',
          data: {
            identity: this.username,
            room: ele?.receiverId,
            video: 'true',
            audio: 'true',
            callEndType: 'IMMEDIATE_CALL',
            scheduleId: this.scheduleCallId,
            patientName: ele?.patientName,
          },
        };

        const videoCallDialog = this.dialog.open(
          VideoCallComponent,
          dialogConfig
        );
        videoCallDialog.afterClosed().subscribe((e) => {
          if (e) {
            this.snackbarService.error(
              'Patient did not joined the call. Please try after sometime'
            );
            this.scheduledId = localStorage.getItem('scheduledid');
            this.callEndType = localStorage.getItem('callEndType');
            if (this.callEndType === 'IMMEDIATE_CALL') {
              var callDuration = JSON.parse(
                localStorage.getItem('durationCall')
              );

              this.service
                .updateImmediateCompleteStatus(
                  this.scheduledId,
                  callDuration.duration
                )
                .subscribe(() => {
                  this.leaveRoom();
                  localStorage.removeItem('openedAudioCallDialog');
                  localStorage.removeItem('callDurationTime');
                  localStorage.removeItem('scheduledid');
                  localStorage.removeItem('callEndType');
                });
            } else if (this.callEndType === 'SCHEDULE_CALL') {
              var callDuration = JSON.parse(
                localStorage.getItem('durationCall')
              );
              if (callDuration?.duration === '00:00') {
                this.service.callNotJoined(this.scheduledId).subscribe(() => {
                  this.leaveRoom();
                  localStorage.removeItem('openedAudioCallDialog');
                  localStorage.removeItem('callDurationTime');
                  localStorage.removeItem('scheduledid');
                  localStorage.removeItem('callEndType');
                });
              } else {
                this.service
                  .updateScheduleCompleteStatus(
                    this.scheduledId,
                    callDuration.duration
                  )
                  .subscribe(() => {
                    this.leaveRoom();
                    localStorage.removeItem('openedAudioCallDialog');
                    localStorage.removeItem('callDurationTime');
                    localStorage.removeItem('scheduledid');
                    localStorage.removeItem('callEndType');
                  });
              }
            }
            setTimeout(() => {
              location.reload();
            }, 4000);
          } else {
            location.reload();
          }
        });
      },
      (err) => {
        this.snackbarService.error(err.message);
      }
    );
  }

  startAudioCall(ele): void {
    this.userId = this.user?.userDetails?.id;
    this.username =
      this.user?.userDetails['firstName'] +
      ' ' +
      this.user?.userDetails['lastName'];
    if (
      this.username == undefined ||
      this.username == null ||
      this.username == ''
    ) {
      return;
    }
    const callType = 'SCHEDULE_VOICECALL';
    const body = {
      patientName: ele.patientName,
      senderName: this.username,
      senderId: this.userId,
      receiverId: ele.receiverId,
      callType: callType,
      scheduleDate: new Date().toUTCString(),
      call: 'ATTEND',
      scheduledBy: 'null',
      scheduleCallStatus: 'INPROGRESS',
    };
    // this.service.immediateCall(body).subscribe(
    // (res) => {
    // this.scheduleCallId = res.id;

    this.service.setCallStarted(ele.id).subscribe(
      (res) => {
        this.scheduleCallId = ele.id;
        localStorage.setItem('scheduledid', this.scheduleCallId);
        localStorage.setItem('callEndType', 'SCHEDULE_CALL');
        const audioModalConfig: MatDialogConfig = {
          disableClose: true,
          closeOnNavigation: false,
          hasBackdrop: false,
          maxHeight: '100vh',
          maxWidth: '1762px',
          height: '82vh',
          width: '50%',
          panelClass: 'audio-call-container',
          data: {
            scheduleId: this.scheduleCallId,
            identity: this.username,
            room: ele?.receiverId,
            video: 'false',
            audio: 'true',
            callEndType: 'IMMEDIATE_CALL',
            patientName: ele?.patientName,
          },
        };
        const audioCallDialog = this.dialog.open(
          AudioCallComponent,
          audioModalConfig
        );
        audioCallDialog.afterClosed().subscribe((e) => {
          if (e) {
            this.snackbarService.error(
              'Patient did not joined the call. Please try after sometime'
            );
            this.scheduledId = localStorage.getItem('scheduledid');
            this.callEndType = localStorage.getItem('callEndType');

            if (this.callEndType == 'IMMEDIATE_CALL') {
              var callDuration = JSON.parse(
                localStorage.getItem('durationCall')
              );
              this.service
                .updateImmediateCompleteStatus(
                  this.scheduledId,
                  callDuration.duration
                )
                .subscribe(() => {
                  this.leaveRoom();
                  localStorage.removeItem('openedAudioCallDialog');
                  localStorage.removeItem('callDurationTime');
                  localStorage.removeItem('scheduledid');
                  localStorage.removeItem('callEndType');
                });
            } else if (this.callEndType === 'SCHEDULE_CALL') {
              var callDuration = JSON.parse(
                localStorage.getItem('durationCall')
              );
              if (callDuration?.duration === '00:00') {
                this.service.callNotJoined(this.scheduledId).subscribe(() => {
                  this.leaveRoom();
                  localStorage.removeItem('openedAudioCallDialog');
                  localStorage.removeItem('callDurationTime');
                  localStorage.removeItem('scheduledid');
                  localStorage.removeItem('callEndType');
                });
              } else {
                this.service
                  .updateScheduleCompleteStatus(
                    this.scheduledId,
                    callDuration?.duration
                  )
                  .subscribe(() => {
                    this.leaveRoom();
                    localStorage.removeItem('openedAudioCallDialog');
                    localStorage.removeItem('callDurationTime');
                    localStorage.removeItem('scheduledid');
                    localStorage.removeItem('callEndType');
                  });
              }
            }
            setTimeout(() => {
              location.reload();
            }, 4000);
          } else {
            location.reload();
          }
        });
      },
      (err) => {
        this.snackbarService.error(err.message);
      }
    );

    //   },
    //   (err) => {
    //     this.snackbarService.error(err.message);
    //   }
    // );
    // const audioModalConfig: MatDialogConfig = {
    //   disableClose: true,
    //   closeOnNavigation: false,
    //   hasBackdrop: false,
    //   maxHeight: '100vh',
    //   maxWidth: '1762px',
    //   height: '82vh',
    //   width: '50%',
    //   panelClass: 'audio-call-container',
    //   data: {
    //     scheduleId: ele.id,
    //     identity: ele.patientName,
    //     room: ele.receiver,
    //     video: 'false',
    //     audio: 'true',
    //     callEndType: 'SCHEDULE_CALL',
    //     patientName: ele.patientName,
    //   },
    // };
    // const audioCallDialog = this.dialog.open(
    //   AudioCallComponent,
    //   audioModalConfig
    // );
    // audioCallDialog.afterClosed().subscribe(() => {
    //   location.reload();
    // });
  }
  stopTracks(): void {
    if (this.activeRoom) {
      this.activeRoom.localParticipant.videoTracks.forEach((publication) => {
        publication.track.stop();
      });
      this.activeRoom.localParticipant.audioTracks.forEach((publication) => {
        publication.track.stop();
      });
      this.activeRoom.localParticipant.tracks.forEach((publication) => {
        publication.unpublish();
      });
    }
  }
  leaveRoom(): void {
    this.participants?.clear();
    this.stopTracks();
    if (this.activeRoom) {
      this.activeRoom.disconnect();
      this.activeRoom = null;
    }
  }
  getAsDate(day, time) {
    let hours = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == 'pm' && hours < 12) {
      hours = hours + 12;
    }
    if (AMPM == 'am' && hours == 12) {
      hours = hours - 12;
    }
    let sHours = hours.toString();
    let sMinutes = minutes.toString();

    if (hours < 10) {
      sHours = '0' + sHours;
    }
    if (minutes < 10) {
      sMinutes = '0' + sMinutes;
    }
    time = sHours + ':' + sMinutes + ':00';
    const d: Date = new Date(day);
    d.setDate(d.getDate() + 1);
    const n = d.toISOString().substring(0, 10);
    const newDate = n + 'T' + time;
    return newDate;
  }
}
