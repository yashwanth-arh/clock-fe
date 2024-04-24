import { connect, ConnectOptions, LocalTrack, Room } from 'twilio-video';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReplaySubject, Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { environment } from 'src/environments/environment';

interface AuthToken {
  token: string;
}

export interface NamedRoom {
  id: string;
  name: string;
  maxParticipants?: number;
  participantCount: number;
}

export type Rooms = NamedRoom[];

@Injectable()
export class VideoChatService {
  $roomsUpdated: Observable<boolean>;
  cpid: any;
  userRole: string;
  isRemoteParticipantVideoOff: BehaviorSubject<boolean>;

  private roomBroadcast = new ReplaySubject<boolean>();
  public apiBaseUrl: string;
  public iheathApi: string;
  public uniqueUrl: string;
  constructor(
    private readonly http: HttpClient,
    public route: ActivatedRoute,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private authStateService: AuthStateService
  ) {
    const user = this.authService.authData;
    this.uniqueUrl = environment.uniqueUrl;
    this.userRole = user?.userDetails?.userRole;
    this.$roomsUpdated = this.roomBroadcast.asObservable();
    this.isRemoteParticipantVideoOff = new BehaviorSubject(false);

    this.cpid = route.params['value'].id;

    this.authStateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }

  get isRemotePartiticipantVideoOff$(): Observable<boolean> {
    return this.isRemoteParticipantVideoOff.asObservable();
  }

  setIsRemoteParticipantVideoOff(value: boolean): void {
    this.isRemoteParticipantVideoOff.next(value);
  }

  private async getAuthToken(identity: string, roomName: string) {
    const idx = identity ? identity : 'chc';
    const auth = await this.http
      .get<AuthToken>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/token?roomName=${roomName}&identity=${identity}`
      )
      .toPromise();
    return auth.token;
  }
  getAllRooms() {
    return this.http
      .get<Rooms>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/all`
      )
      .toPromise();
  }

  postNotification(
    patientId: string,
    token: string,
    audio?: boolean,
    video?: boolean
  ): any {
    this.cpid = patientId;

    // const user = this.authService.authData;
    const headers = new HttpHeaders();
    const body = {
      patientId,
      roomName: patientId,
      twilioAccessToken: 'Bearer ' + token,
      audio,
      video,
    };

    headers.set('Authorization', 'Bearer ' + token);
    const notification = this.http
      .post(`${this.apiBaseUrl}/videoCallNotificationSend`, body, {
        headers,
      })
      .subscribe();
    setTimeout(() => {
      this.snackbar.success('Notification sent successfully.');
    });
    // notification.unsubscribe();
  }

  postDocNotification(
    patientId: string,
    token: string,
    audio?: boolean,
    video?: boolean
  ): any {
    this.cpid = patientId;

    const headers = new HttpHeaders();
    const body = {
      patientId,
      roomName: patientId,
      twilioAccessToken: 'Bearer ' + token,
      audio,
      video,
    };

    headers.set('Authorization', 'Bearer ' + token);
    const notification = this.http
      .post(`${this.apiBaseUrl}/videoCallNotificationSend`, body, {
        headers,
      })
      .subscribe();
    setTimeout(() => {
      this.snackbar.success('Notification sent successfully.');
    });
    // notification.unsubscribe();
  }

  async joinOrCreateRoom(
    name: string,
    tracks: LocalTrack[],
    identity: string,
    audio?: boolean,
    video?: boolean
  ) {
    let room: Room = null;

    try {
      const token = await this.getAuthToken(identity, name);
      room = await connect(token, {
        name,
        tracks,
        dominantSpeaker: true,
      } as ConnectOptions);

      if (room) {
        /**
         * Assuming the room name  === patientId
         * TODO: in future if the room name gets changed pass the patientid as an extra argument
         */
        // if (this.userRole === 'CAREGIVER') {
        //   this.postNotification(name, token, audio, video);
        // } else if (this.userRole === 'DOCTOR') {
        //   this.postDocNotification(name, token, audio, video);
        // }
      }
    } catch (error) {
      // console.error(`Unable to connect to Room: ${error.message}`);
    } finally {
      if (room) {
        this.roomBroadcast.next(true);
      }
    }

    return room;
  }

  nudge(): void {
    this.roomBroadcast.next(true);
  }

  async joinOrCreateAudioCallRoom(
    name: string,
    identity: string,
    audio?: boolean,
    video?: boolean
  ) {
    let room: Room = null;
    try {
      const token = await this.getAuthToken(identity, name);

      room = await connect(token, {
        name,
        dominantSpeaker: true,
        video: false,
        audio: true,
      } as ConnectOptions);
      if (room) {
        /**;
         * Assuming the room name  === patientId;
         * TODO: in future if the room name gets changed pass the patientid as an extra argument;
         */
        // if (this.userRole === 'CAREGIVER') {;
        //   await this.postNotification(name, token, audio, video);
        // } else if (this.userRole === 'DOCTOR') {;
        //   await this.postDocNotification(name, token, audio, video);
        // };
      }
    } catch (error) {
      // console.error(`Unable to connect to Room: ${error.message}`);
    } finally {
      if (room) {
        this.roomBroadcast.next(true);
      }
    }

    return room;
  }
}
