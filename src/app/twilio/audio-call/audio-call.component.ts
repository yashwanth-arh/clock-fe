import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  createLocalAudioTrack,
  LocalAudioTrack,
  LocalTrack,
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrackPublication,
  Room,
} from 'twilio-video';
import { ParticipantsComponent } from '../participants/participants.component';
import { RoomState, VideoStateService } from '../services/video-state.service';
import { VideoChatService } from '../services/videochat.service';
import { SettingsComponent } from '../settings/settings.component';
import { TimerComponent } from 'src/app/core/components/timer/timer.component';
import { AudioStateService } from '../services/audio-state.service';
import { ObservationBody } from 'src/app/shared/entities/observation-duration';
import { interval, Observable, Subscription } from 'rxjs';
import { ClaimsTimerService } from 'src/app/core/services/claims-timer.service';
import { CallHistoryService } from '../call-history/service/call-history.service';
import { VideoAudioSettingsService } from '../services/video-audio-settings.service';
import { CallHistory } from 'src/app/shared/entities/call-history';
import _ from 'lodash';

@Component({
  selector: 'app-audio-call',
  templateUrl: './audio-call.component.html',
  styleUrls: ['./audio-call.component.scss'],
})
export class AudioCallComponent implements OnInit {
  public compress: boolean;
  public startTimer: boolean;
  public muteAudio: boolean;
  public muteVideo: boolean;
  public activeRoom: Room;
  public duration: string;
  public timeExceeded = false;
  observationStartTime = new Date().getTime();
  // @ViewChild('camera') camera: CameraComponent;
  private patientCallTimer: Observable<number> = interval(1000);
  private timerSubscription: Subscription;
  public patientCall = 0;
  public currentPatientId: string;
  public hasPermissions: boolean;
  callStateSubscription: Subscription;
  @ViewChild('settings') settings: SettingsComponent;
  @ViewChild('participants') participants: ParticipantsComponent;
  @ViewChild('timer') timer: TimerComponent;
  tabMedia: any = window.matchMedia('(max-width:1280px)');
  constructor(
    private readonly videoChatService: VideoChatService,
    private service: CaregiverDashboardService,
    public videoStateService: VideoStateService,
    public audioStateService: AudioStateService,
    public router: Router,
    public datepipe: DatePipe,
    public snackbarService: SnackbarService,
    public settingService: VideoAudioSettingsService,
    public dialogRef: MatDialogRef<AudioCallComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private claimTimerService: ClaimsTimerService
  ) {
    this.compress = false;
    this.startTimer = false;
  }

  async ngOnInit(): Promise<void> {
    this.currentPatientId = localStorage.getItem('patientId');
    this.patientCall = this.claimTimerService.getTimerObjVal(
      this.currentPatientId,
      'patientCall'
    );
    this.settingService
      .hasPermissions()
      .then(async (res) => {
        this.hasPermissions = res;

        if (res && this.data) {          
          await this.initRoom(this.data);
          // save the call details
          // const callDetails: CallHistory = {
          // 	roomName: this.data.room,
          // 	sender: this.data.identity,
          // 	reciever: '',
          // 	typeOfCall: 'audio',
          // 	patientName: this.data.patientName ? this.data.patientName : '',
          // 	status: 'INITIATED',
          // };
          // this.callHistoryService
          // 	.createCallRecord(callDetails)
          // 	.subscribe(() => {});
        } else {
          // console.error('Permissions denied!');
        }
      })
      .catch((err) => {});
    this.callStateSubscription =
      this.audioStateService.audioRoomState$.subscribe((res: RoomState) => {
        if (res === 'REMOTECONNECTED') {
          this.videoStateService.setIsAlone(false);
          this.timer.startTimer();
        }
      });
    this.timerSubscription = this.patientCallTimer.subscribe((res) => {
      this.patientCall++;
      this.claimTimerService.updateTimerObj(
        this.currentPatientId,
        'patientCall',
        this.patientCall
      );
      this.claimTimerService.updateTimerObj(
        this.currentPatientId,
        'graphReview',
        0
      );
      this.claimTimerService.updateTimerObj(
        this.currentPatientId,
        'dasboardReview',
        0
      );
      this.claimTimerService.updateTimerObj(
        this.currentPatientId,
        'clinincalNotes',
        0
      );
      if (res % 30 === 0) {
        this.patientCall = 0;
        this.claimTimerService.updateTimerObj(
          this.currentPatientId,
          'patientCall',
          0
        );
        this.claimTimerService.updateTimerObj(
          this.currentPatientId,
          'graphReview',
          0
        );
        this.claimTimerService.updateTimerObj(
          this.currentPatientId,
          'dasboardReview',
          0
        );
        this.claimTimerService.updateTimerObj(
          this.currentPatientId,
          'clinincalNotes',
          0
        );
      }
    });
  }

  async initRoom(params: any): Promise<void> {
    
    this.videoStateService.setCallType('audio');
    const { room, identity, audio, video, patientName } = params;
    

    this.videoStateService.setWaitingFor(patientName);

    setTimeout(async () => {
      if (room) {
        if (this.activeRoom) {
          this.activeRoom.disconnect();
        }
        // this.camera.finalizePreview();

        const tracks = await Promise.all([createLocalAudioTrack()]);
        this.activeRoom = await this.videoChatService.joinOrCreateAudioCallRoom(
          room,
          identity,
          audio,
          video
        );
        setTimeout(() => {
          if (!this.activeRoom.participants.size) {
            this.timeExceeded = true;
            this.leaveRoom();
            // this.snackbarService.error('Patient did not joined the call. Please try after sometime');
          }
        }, 60000);
        if (this.activeRoom && this.activeRoom?.participants.size) {
          this.audioStateService.setAudioRoomState('REMOTECONNECTED');
          this.timer.startTimer();
        } else {
          this.audioStateService.setAudioRoomState('CONNECTED');
        }
        this.participants.initialize(this.activeRoom?.participants);
        this.registerRoomEvents();
      }
    }, 2000);
  }

  async onLeaveRoom(event: boolean): Promise<void> {
    let actualDuration;
    const durationVal = JSON.parse(localStorage.getItem('durationCall'));
    const callDuration = this.timer?.timerDuration;
    if (
      callDuration !== null &&
      callDuration.minutes === 0 &&
      callDuration.seconds === 0
    ) {
      actualDuration = durationVal.duration;
    } else {
      actualDuration = callDuration.duration;
    }

    // if (actualDuration == '00:00') {
    //   // if no duration recorded

    //   this.service.updateCallStatus(this.data.scheduleId).subscribe(() => {
    //     this.leaveRoom();
    //   });
    // } else {
    // if duration recorded
    if (this.data.callEndType === 'IMMEDIATE_CALL') {
      if (callDuration?.duration === '00:00') {
        this.service.callNotAttended(this.data.scheduleId).subscribe(() => {
          this.leaveRoom();
          localStorage.removeItem('openedAudioCallDialog');
          localStorage.removeItem('callDurationTime');
          localStorage.removeItem('scheduledid');
          localStorage.removeItem('callEndType');
        });
      }
      else{
      this.service
        .updateImmediateCompleteStatus(this.data.scheduleId, actualDuration)
        .subscribe(() => {
          this.leaveRoom();
        });
      }
    } else if (this.data.callEndType === 'SCHEDULE_CALL') {
      if (callDuration?.duration === '00:00') {
        this.service.callNotJoined(this.data.scheduleId).subscribe(() => {
          this.leaveRoom();
          localStorage.removeItem('openedAudioCallDialog');
          localStorage.removeItem('callDurationTime');
          localStorage.removeItem('scheduledid');
          localStorage.removeItem('callEndType');
        });
      } 
      else{
      this.service
        .updateScheduleCompleteStatus(this.data.scheduleId, actualDuration)
        .subscribe(() => {
          this.leaveRoom();
        });
      }
    }
    // }
    localStorage.removeItem('openedAudioCallDialog');
    localStorage.removeItem('callDurationTime');
    localStorage.removeItem('scheduledid');
    localStorage.removeItem('callEndType');
  }
  leaveRoom(): void {
    this.participants.clear();
    this.stopTracks();
    if (this.activeRoom) {
      this.activeRoom.disconnect();
      this.activeRoom = null;
    }
    this.close();
  }
  onParticipantsChanged(event: boolean): void {
    this.videoChatService.nudge();
  }

  private registerRoomEvents(): void {
    this.activeRoom
      ?.on('disconnected', (room: Room) => {
        this.audioStateService.setAudioRoomState('LOCALDISCONNECTED');
        room.localParticipant.tracks.forEach((publication) =>
          this.detachLocalTrack(publication.track)
        );
        // this.startTimer = false;
      })
      .on('participantConnected', (participant: RemoteParticipant) => {
        this.audioStateService.setAudioRoomState('REMOTECONNECTED');
        this.participants.add(participant);
        this.timer.startTimer();
        this.startTimer = true;
      })
      .on('participantDisconnected', (participant: RemoteParticipant) => {
        this.audioStateService.setAudioRoomState('REMOTEDISCONNECTED');
        this.participants.remove(participant);
        this.videoStateService.setRemoteParticipantName(null);
        this.videoStateService.setIsAlone(true);
        this.timer.startTimer();
        this.startTimer = false;
        //
      })
      .on('dominantSpeakerChanged', (dominantSpeaker: RemoteParticipant) =>
        this.participants.loudest(dominantSpeaker)
      )
      .on('trackDisabled', (publication: RemoteTrackPublication) => {
        if (publication.kind === 'video') {
          this.videoChatService.setIsRemoteParticipantVideoOff(
            !publication.isTrackEnabled
          );
        }
      })
      .on('trackEnabled', (publication: RemoteTrackPublication) => {
        if (publication.kind === 'video') {
          this.videoChatService.setIsRemoteParticipantVideoOff(
            !publication.isTrackEnabled
          );
        }
      });
  }

  private detachLocalTrack(track: LocalTrack): void {
    if (this.isDetachable(track)) {
      track.detach().forEach((el) => {
        el.remove();
      });
    }
  }

  private isDetachable(
    track: LocalTrack
  ): track is LocalAudioTrack | LocalVideoTrack {
    return (
      !!track &&
      ((track as LocalAudioTrack).detach !== undefined ||
        (track as LocalVideoTrack).detach !== undefined)
    );
  }

  muteAndUnmuteAudio(): void {
    this.muteAudio = !this.muteAudio;
    if (this.activeRoom) {
      if (this.muteAudio) {
        this.activeRoom.localParticipant.audioTracks.forEach((publication) => {
          publication.track.disable();
        });
      } else {
        this.activeRoom.localParticipant.audioTracks.forEach((publication) => {
          publication.track.enable();
        });
      }
    }
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

  close(): void {
    this.dialogRef.close(this.timeExceeded);
    this.timerSubscription.unsubscribe();
  }
  toggleSize(): void {
    this.compress = !this.compress;
    if (this.compress) {
      this.dialogRef.updateSize('25%', '25vh');
      this.dialogRef.updatePosition({
        top: this.tabMedia.matches ? '60vh' : '74vh',
        right: '3px',
      });
    } else {
      this.dialogRef.updateSize('50%', '92vh');
      this.dialogRef.updatePosition({ top: '20px' });
    }
  }
  setObservationTime(): void {
    const timeSpent = Math.floor(
      (new Date().getTime() - this.observationStartTime) / 1000
    );
    const updateBody: ObservationBody = {};
    updateBody.clinincalNotes = timeSpent;
    localStorage.setItem('calltimeSpentDuration', JSON.stringify(timeSpent));
  }
}
