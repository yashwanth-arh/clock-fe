import {
  Component,
  ViewChild,
  ElementRef,
  Output,
  Input,
  EventEmitter,
  Renderer2,
} from '@angular/core';
import { timer, Subscription } from 'rxjs';
import {
  Participant,
  RemoteTrack,
  RemoteAudioTrack,
  RemoteVideoTrack,
  RemoteParticipant,
  RemoteTrackPublication,
} from 'twilio-video';
import { VideoStateService } from '../services/video-state.service';

@Component({
  selector: 'app-participants',
  styleUrls: ['./participants.component.scss'],
  templateUrl: './participants.component.html',
})
export class ParticipantsComponent {
  @ViewChild('list') listRef: ElementRef;
  @Output() participantsChanged = new EventEmitter<boolean>();
  @Output() leaveRoom = new EventEmitter<boolean>();
  @Input() activeRoomName: string;
  @Input() compressed: boolean;
  // countDown: Subscription;
  // counter = 60;
  // tick = 1000;
  get participantCount(): number {
    return this.participants ? this.participants.size : 0;
  }

  get isAlone(): boolean {
    return this.participantCount === 0;
  }

  private participants: Map<Participant.SID, RemoteParticipant>;
  private dominantSpeaker: RemoteParticipant;

  constructor(
    private readonly renderer: Renderer2,
    public stateService: VideoStateService
  ) {}
  // ngOnInit() {
  //   // this.countDown = timer(0, this.tick).subscribe(() => --this.counter);
  // }
  clear(): void {
    if (this.participants) {
      this.participants.clear();
    }
  }

  initialize(participants: Map<Participant.SID, RemoteParticipant>): void {
    this.participants = participants;
    if (this.participants) {
      this.participants.forEach((participant) =>
        this.registerParticipantEvents(participant)
      );
    }
  }

  add(participant: RemoteParticipant): void {
    if (this.participants && participant) {
      this.participants.set(participant.sid, participant);
      this.registerParticipantEvents(participant);

      this.stateService.setRemoteParticipantName(participant.identity);
      this.stateService.setIsAlone(false);
    }
  }

  remove(participant: RemoteParticipant): void {
    if (this.participants && this.participants.has(participant.sid)) {
      this.participants.delete(participant.sid);
    }
  }

  loudest(participant: RemoteParticipant): void {
    this.dominantSpeaker = participant;

    this.stateService.setRemoteParticipantName(participant?.identity);
  }

  onLeaveRoom(): void {
    this.leaveRoom.emit(true);
  }

  private registerParticipantEvents(participant: RemoteParticipant): void {
    if (participant) {
      this.stateService.setRemoteParticipantName(participant.identity);
      participant.tracks.forEach((publication) => this.subscribe(publication));
      participant.on('trackPublished', (publication) =>
        this.subscribe(publication)
      );
      participant.on('trackUnpublished', (publication) => {
        if (publication && publication.track) {
          this.detachRemoteTrack(publication.track);
        }
      });
    }
  }

  private subscribe(publication: RemoteTrackPublication | any): void {
    if (publication && publication.on) {
      publication.on('subscribed', (track: RemoteTrack) =>
        this.attachRemoteTrack(track)
      );
      publication.on('unsubscribed', (track: RemoteTrack) =>
        this.detachRemoteTrack(track)
      );
    }
  }

  private attachRemoteTrack(track: RemoteTrack): void {
    if (this.isAttachable(track)) {
      const element = track.attach();
      this.renderer.data.id = track.sid;
      this.renderer.setStyle(element, 'width', '90%');
      this.stateService.callType$.subscribe((res) => {
        if (res === 'video') {
          this.renderer.appendChild(this.listRef.nativeElement, element);
        }
      });
      this.participantsChanged.emit(true);
    }
  }

  private detachRemoteTrack(track: RemoteTrack): void {
    if (this.isDetachable(track)) {
      track.detach().forEach((el) => el.remove());
      this.participantsChanged.emit(true);
    }
  }

  private isAttachable(
    track: RemoteTrack
  ): track is RemoteAudioTrack | RemoteVideoTrack {
    return (
      !!track &&
      ((track as RemoteAudioTrack).attach !== undefined ||
        (track as RemoteVideoTrack).attach !== undefined)
    );
  }

  private isDetachable(
    track: RemoteTrack
  ): track is RemoteAudioTrack | RemoteVideoTrack {
    return (
      !!track &&
      ((track as RemoteAudioTrack).detach !== undefined ||
        (track as RemoteVideoTrack).detach !== undefined)
    );
  }
}
