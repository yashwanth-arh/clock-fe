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
export class DashboardSharedService {
    constructor(private http: HttpClient, 
        private _decimalPipe: DecimalPipe,
        ) { }
    public filterDataTriggered: BehaviorSubject<string> =
        new BehaviorSubject<string>('');
        public tabDataTriggered: BehaviorSubject<string> =
        new BehaviorSubject<string>('');
    changeFilterData(message) {
        this.filterDataTriggered.next(message);
    }
    changeTab(message) {
        this.tabDataTriggered.next(message);
    }
}