import { values } from 'lodash';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
export type CallType = 'video' | 'audio' | null;
export type RoomState = 'INITIATED' | 'CONNECTED' | 'LOCALDISCONNECTED' | 'REMOTEDISCONNECTED' | 'COMPLETED' | 'REMOTECONNECTED';
@Injectable({
  providedIn: 'root'
})
export class VideoStateService {
  private remoteParticipantName: BehaviorSubject<string | null>;
  private waitingFor: BehaviorSubject<string | null>;
  private isAlone: BehaviorSubject<boolean>;
  private callType: BehaviorSubject<CallType>;
  private activeTabIndex: BehaviorSubject<number | null>;
  private roomState: BehaviorSubject<RoomState>;
  private dataRefresh: BehaviorSubject<boolean>;
  constructor() {
    this.remoteParticipantName = new BehaviorSubject(null);
    this.waitingFor = new BehaviorSubject(null);
    this.isAlone = new BehaviorSubject(true);
    this.callType = new BehaviorSubject(null);
    this.activeTabIndex = new BehaviorSubject(parseInt(localStorage.getItem('care-giver-tab-index'), 0));
    this.roomState = new BehaviorSubject('INITIATED');
    this.dataRefresh = new BehaviorSubject(Boolean(localStorage.getItem('flush')));
  }
  get dataRefresh$(): Observable<boolean> {
    return this.dataRefresh.asObservable();
  }

  setDatarefresh(value: boolean): void {
    this.dataRefresh.next(value);
    localStorage.setItem('flush', value.toString());
  }
  get remoteParticipantName$(): Observable<string | null> {
    return this.remoteParticipantName.asObservable();
  }

  setRemoteParticipantName(value: string | null): void {
    this.remoteParticipantName.next(value);
  }

  get waitingFor$(): Observable<string | null> {
    return this.waitingFor.asObservable();
  }

  setWaitingFor(value: string | null): void {
    this.waitingFor.next(value);
  }


  get isAlone$(): Observable<boolean> {
    return this.isAlone.asObservable();
  }

  setIsAlone(value: boolean): void {
    this.isAlone.next(value);
  }

  get callType$(): Observable<CallType> {
    return this.callType.asObservable();
  }

  setCallType(value: CallType): void {
    this.callType.next(value);
  }

  get activeTabIndex$(): Observable<number> {
    return this.activeTabIndex.asObservable();
  }

  setActiveTabIndex(value: number): void {
    this.activeTabIndex.next(value);    
  }

  get roomState$(): Observable<RoomState> {
    return this.roomState.asObservable();
  }

  setRoomState(value: RoomState): void {
    this.roomState.next(value);
  }
}
