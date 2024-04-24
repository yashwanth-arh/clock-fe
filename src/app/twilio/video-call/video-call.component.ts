import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CallHistory } from 'src/app/shared/entities/call-history';

import {
  createLocalAudioTrack,
  LocalAudioTrack,
  LocalTrack,
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrackPublication,
  Room,
} from 'twilio-video';
import { CameraComponent } from '../camera/camera.component';
import { ParticipantsComponent } from '../participants/participants.component';
import { RoomState, VideoStateService } from '../services/video-state.service';
import { VideoChatService } from '../services/videochat.service';
import { SettingsComponent } from '../settings/settings.component';
import { TimerComponent } from 'src/app/core/components/timer/timer.component';
import { ObservationBody } from 'src/app/shared/entities/observation-duration';
import { interval, Observable, Subscription } from 'rxjs';
import { ClaimsTimerService } from 'src/app/core/services/claims-timer.service';
import { VideoAudioSettingsService } from '../services/video-audio-settings.service';
import { CallHistoryService } from '../call-history/service/call-history.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss'],
})
export class VideoCallComponent implements OnInit {
  public compress: boolean;
  public startTimer: boolean;
  public muteAudio: boolean;
  public muteVideo: boolean;
  public activeRoom: Room;
  public duration: string;
  private patientCallTimer: Observable<number> = interval(1000);
  private timerSubscription: Subscription;
  public patientCall = 0;
  public currentPatientId: string;
  public hasPermissions: boolean;
  public timeExceeced = false;
  observationStartTime = new Date().getTime();
  callStateSubscription: Subscription;
  @ViewChild('camera') camera: CameraComponent;
  @ViewChild('settings') settings: SettingsComponent;
  @ViewChild('participants') participants: ParticipantsComponent;
  @ViewChild('timer') timer: TimerComponent;
  tabMedia: any = window.matchMedia('(max-width:1280px)');
  constructor(
    private readonly videoChatService: VideoChatService,
    public videoStateService: VideoStateService,
    private service: CaregiverDashboardService,
    public dialogRef: MatDialogRef<VideoCallComponent>,
    private callHistoryService: CallHistoryService,
    public settingService: VideoAudioSettingsService,
    private snackbarService: SnackbarService,
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
    this.settingService.hasPermissions().then(async (res) => {
      this.hasPermissions = res;
      if (res && this.data) {
        await this.initRoom(this.data);
        // save the call details
        // const callDetails: CallHistory = {
        // 	roomName: this.data.room,
        // 	sender: this.data.identity,
        // 	reciever: '',
        // 	typeOfCall: 'video',
        // 	patientName: this.data.patientName ? this.data.patientName : '',
        // 	status: 'INITIATED',
        // };
        // this.callHistoryService
        // 	.createCallRecord(callDetails)
        // 	.subscribe(() => {});
      } else {
        // console.error('Permissions denied!');
      }
    });

    this.callStateSubscription = this.videoStateService.roomState$.subscribe(
      (res: RoomState) => {
        if (res == 'REMOTECONNECTED') {
          // this.startTimer = true;
          this.videoStateService.setIsAlone(false);
          this.timer.startTimer();
        }
      }
    );

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
    this.videoStateService.setCallType('video');
    const { room, identity, audio, video, patientName } = params;
    this.videoStateService.setWaitingFor(patientName);
    setTimeout(async () => {
      if (room) {
        if (this.activeRoom) {
          this.activeRoom.disconnect();
        }
        this.camera.finalizePreview();

        const tracks = await Promise.all([
          createLocalAudioTrack(),
          this.settings.showPreviewCamera(),
        ]);

        this.activeRoom = await this.videoChatService.joinOrCreateRoom(
          room,
          tracks,
          identity,
          audio,
          video
        );
        setTimeout(() => {
          if (!this.activeRoom.participants.size) {
            this.timeExceeced = true;
            this.leaveRoom();
            // this.snackbarService.error('Patient did not joined the call. Please try after sometime');
          }
        }, 60000);
        if (this.activeRoom && this.activeRoom.participants.size) {
          this.videoStateService.setRoomState('REMOTECONNECTED');
          this.timer.startTimer();
        } else {
          this.videoStateService.setRoomState('CONNECTED');
        }

        this.participants?.initialize(this.activeRoom?.participants);
        if (this.activeRoom) {
          this.registerRoomEvents();
        } else {
          this.dialogRef.close('PERMISSIONS_REQUIRED');
        }
        if (audio === 'false') {
          this.muteAndUnmuteAudio();
        }
        if (video === 'false') {
          this.muteAndUnmuteVideo();
        }
      }
    }, 2000);
  }
  async onSettingsChanged(deviceInfo?: MediaDeviceInfo) {
    await this.camera.initializePreview(deviceInfo.deviceId);
    if (this.settings.isPreviewing) {
      const track = await this.settings.showPreviewCamera();
      if (this.activeRoom) {
        const localParticipant = this.activeRoom.localParticipant;
        localParticipant.videoTracks.forEach((publication) =>
          publication.unpublish()
        );
        await localParticipant.publishTrack(track);
      }
    }
  }

  async onLeaveRoom(event: boolean): Promise<void> {
    const callDuration = this.timer?.timerDuration
      ? this.timer?.timerDuration
      : null;
    // if (
    //   callDuration !== null &&
    //   callDuration.minutes === 0 &&
    //   callDuration.seconds === 0
    // ) {
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
        .updateImmediateCompleteStatus(
          this.data.scheduleId,
          this.timer?.timerDuration?.duration
        )
        .subscribe(() => {
          this.leaveRoom();
          localStorage.removeItem('callDuration');
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
        .updateScheduleCompleteStatus(
          this.data.scheduleId,
          this.timer?.timerDuration?.duration
        )
        .subscribe(() => {
          this.leaveRoom();
          localStorage.removeItem('callDuration');
        });
      }
    }
    // }
  }
  leaveRoom(): void {
    const videoDevice = this.settings.hidePreviewCamera();
    this.camera.initializePreview(videoDevice && videoDevice.deviceId);
    this.participants.clear();
    this.camera.closeTracks();
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
      .on('disconnected', (room: Room) => {
        this.videoStateService.setRoomState('LOCALDISCONNECTED');
        room.localParticipant.tracks.forEach((publication) =>
          this.detachLocalTrack(publication.track)
        );
        // this.startTimer = false;
      })
      .on('participantConnected', (participant: RemoteParticipant) => {
        this.videoStateService.setRoomState('REMOTECONNECTED');
        this.participants.add(participant);
        this.timer.startTimer();
        // this.startTimer = true;
      })
      .on('participantDisconnected', (participant: RemoteParticipant) => {
        this.videoStateService.setRoomState('REMOTEDISCONNECTED');
        this.participants.remove(participant);
        this.videoStateService.setRemoteParticipantName(null);
        this.videoStateService.setIsAlone(true);
        this.timer.startTimer();
        this.startTimer = false;
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
      })
      .on('trackPublished', () => {
        this.videoStateService.setIsAlone(false);
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

  muteAndUnmuteVideo(): void {
    this.muteVideo = !this.muteVideo;
    if (this.activeRoom) {
      if (this.muteVideo) {
        this.activeRoom.localParticipant.videoTracks.forEach((publication) => {
          publication.track.disable();
          this.settings.hidePreviewCamera();
          this.videoChatService.setIsRemoteParticipantVideoOff(true);
        });
      } else {
        this.activeRoom.localParticipant.videoTracks.forEach((publication) => {
          publication.track.enable();
          this.settings.showPreviewCamera();
          this.videoChatService.setIsRemoteParticipantVideoOff(false);
        });
      }
    }
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
    this.dialogRef.close(this.timeExceeced);
    this.timerSubscription.unsubscribe();
  }

  toggleSize(): void {
    this.compress = !this.compress;
    localStorage.setItem('compressCall', JSON.stringify(this.compress));
    if (this.compress) {
      this.dialogRef.updateSize('25%', '25vh');
      this.dialogRef.updatePosition({
        top: this.tabMedia.matches ? '60vh' : '74vh',
        right: '3px',
      });
    } else {
      this.dialogRef.updateSize('60%', '93%');
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
