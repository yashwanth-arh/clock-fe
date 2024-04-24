import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStateService } from './auth-state.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { log } from 'console';

export interface UnitSettings {
  feet?: boolean;
  lastUpdatedAt?: string;
  lbs?: boolean;
  userId?: string;
  version?: number;
  notification?: boolean;
}

export interface UnitBody {
  feet?: boolean;
  lbs?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class SettingsStateService {
  [x: string]: any;
  private weightUnit: BehaviorSubject<string>;
  private heightUnit: BehaviorSubject<string>;
  public apiBaseUrl: string;
  public baseResource: string;
  constructor(
    private http: HttpClient,
    private authStateService: AuthStateService,
    private authService: AuthService
  ) {
    this.weightUnit = new BehaviorSubject<string>(localStorage.getItem('wt'));
    this.heightUnit = new BehaviorSubject<string>(localStorage.getItem('ht'));
    this.authStateService.baseResource.subscribe((res) => {
      this.baseResource = res;
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }

  get weightUnit$(): Observable<string> {
    return this.weightUnit.asObservable();
  }

  get heightUnit$(): Observable<string> {
    return this.heightUnit.asObservable();
  }

  setWeightUnit(value: string): void {
    this.weightUnit.next(value);
    localStorage.setItem('wt', value);
  }

  setHeightUnit(value: string): void {
    this.heightUnit.next(value);
    localStorage.setItem('ht', value);
  }

  getStoredSettings(id: string): Observable<UnitSettings> {
    return this.http
      .get<UnitSettings>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/unitSetting/${id}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateSettings(id: string, body: UnitBody): Observable<UnitSettings> {
    return this.http
      .put<UnitSettings>(
        `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/unitSettings/${id}`,
        body
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
