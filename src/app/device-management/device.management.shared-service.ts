import { MatDrawer } from '@angular/material/sidenav';
import { AuthService } from './../core/services/auth.service';
import { AuthStateService } from './../core/services/auth-state.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DeviceManagementSharedService {
  diffTime: any;
  public apiBaseUrl: string;
  month: any;
  year: number;
  day: any;
  constructor(private http: HttpClient, private _decimalPipe: DecimalPipe) {}
  dryWeight: any;
  public editDataDetails: any = [];
  public subject = new Subject<any>();

  public deviceTypeTriggered: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  changeDeviceType(message) {
    this.deviceTypeTriggered.next(message);
  }
}
