import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoomState } from './video-state.service';

@Injectable({
  providedIn: 'root'
})
export class AudioStateService {
  private audioRoomState: BehaviorSubject<RoomState>;

  constructor() {
    this.audioRoomState = new BehaviorSubject('INITIATED');
  }

  get audioRoomState$(): Observable<RoomState> {
    return this.audioRoomState.asObservable();
  }

  setAudioRoomState(value: RoomState): void {
    this.audioRoomState.next(value);
  }
}
