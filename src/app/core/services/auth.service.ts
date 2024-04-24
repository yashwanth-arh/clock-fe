import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserPermissionGroups } from 'src/app/shared/entities/user-permission-groups';
import { ValidationEmail } from 'src/app/shared/entities/validation-email';
import { Auth } from 'src/app/shared/models/auth.model';
import { User } from 'src/app/shared/models/user.model';
import { VideoStateService } from 'src/app/twilio/services/video-state.service';
import { environment } from 'src/environments/environment';
import { AuthStateService } from './auth-state.service';
import { DashbaordStateService } from 'src/app/CommonComponents/doctor-patients-details/dashbaord-state.service';

export type Services = 'PROFILE' | 'IHEALTH' | 'NULL';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public baseResourceUrl: string;
  apiBaseUrl = `${environment.apiBaseUrl}`;
  public authSubject: BehaviorSubject<Auth>;
  private authObservable: Observable<Auth>;

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private router: Router,
    private http: HttpClient,
    private stateService: AuthStateService,
    private videoState: VideoStateService,
    public caregiverSharedService: CaregiverSharedService,
    private dashbordStateService: DashbaordStateService
  ) {
    this.authSubject = new BehaviorSubject<Auth>(
      JSON.parse(localStorage.getItem('auth'))
    );
    this.stateService.baseResource.subscribe((res) => {
      this.baseResourceUrl = res;
    });
    this.authObservable = this.authSubject.asObservable();
    this.loggedIn = new BehaviorSubject<boolean>(
      Boolean(localStorage.getItem('isLoggedIn'))
    );
  }

  get authData(): Auth {
    return this.authSubject.value;
  }
  get user(): Observable<Auth> {
    return this.authSubject.asObservable();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  setIsLoggedIn(value: boolean): void {
    this.loggedIn.next(value);
  }
  verifyOTP(userName: string, otp: number): Observable<User> {
    return this.http
      .post<User>(`${this.apiBaseUrl}/otpauthenticate`, {
        username: userName,
        password: otp.toString(),
      })
      .pipe(
        map((auth: User) => {
          return auth;
        })
      );
  }
  login(
    username: string,
    password: string,
    flag: boolean,
    uid: string
    // osType: string,
    // osVersion: string
  ): Observable<User> {
    return this.http
      .post<User>(`${this.apiBaseUrl}/authenticate`, {
        username,
        password,
        flag,
        uid,
        // osType,
        // osVersion,
      })
      .pipe(
        map((auth: User) => {
          /**
           * TODO : get permissions from the api
           */
          // const userRole = auth.userDetails.userRole;
          // if (
          //   userRole === 'RPM_ADMIN' ||
          //   userRole === 'BRANCH_USER' ||
          //   userRole === 'hospital_USER'
          // ) {
          //   auth.userDetails.permissions =
          //     UserPermissionGroups[userRole].permissions;
          // }

          // /**
          //  * above code has to be removed once the api sends the role based permissions
          //  */
          // localStorage.setItem('auth', JSON.stringify(auth));
          localStorage.setItem('isLoggedIn', 'true');
          // localStorage.setItem('baseResource', auth.baseResourcePath);
          // this.stateService.setBaseResource(auth.baseResourcePath);
          // this.authSubject.next(auth);
          this.setIsLoggedIn(true);
          return auth;
        })
      );
  }
  updateUID(emailId, uId) {
    return this.http
      .put<Observable<any>>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/updateUid/${emailId}/windows?uId=${uId}`,
        {}
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  OtpAuthenticate(
    username: string,
    password: string,
    flag: boolean,
    uid: string
    // osType: string,
    // osVersion: string
  ): Observable<User> {
    return this.http
      .post<User>(`${this.apiBaseUrl}/otpauthenticate`, {
        username,
        password,
        flag,
        uid,
        // osType,
        // osVersion,
      })
      .pipe(
        map((auth: User) => {
          /**
           * TODO : get permissions from the api
           */
          const userRole = auth.userDetails.userRole;
          if (
            userRole === 'RPM_ADMIN' ||
            userRole === 'BRANCH_USER' ||
            userRole === 'hospital_USER'
          ) {
            auth.userDetails.permissions =
              UserPermissionGroups[userRole].permissions;
          }

          /**
           * above code has to be removed once the api sends the role based permissions
           */
          localStorage.setItem('auth', JSON.stringify(auth));
          localStorage.setItem('isLoggedIn', 'true');
          let inputString = auth.baseResourcePath;
          if (inputString.startsWith('/')) {
            inputString = inputString.substring(1);
          }
          localStorage.setItem('baseResource', inputString);
          this.stateService.setBaseResource(inputString);
          this.authSubject.next(auth);
          this.setIsLoggedIn(true);
          return auth;
        })
      );
  }

  generateBaseUrl(
    serviceName: Services = 'NULL',
    includeResourcePath = true
  ): string {
    let apiUrl = `${environment.apiBaseUrl}`;
    if (serviceName === 'PROFILE') {
      apiUrl += `/${environment.profile_service}`;
    }
    if (serviceName === 'IHEALTH') {
      apiUrl += `/${environment.i_health_service} `;
    }
    return apiUrl;
  }

  logout(): void {
    this.log_out().subscribe((res) => {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/login']);
      // this.authSubject.next(null);
      // this.videoState.setActiveTabIndex(0);
      // localStorage.removeItem('BPLineData');
      // localStorage.removeItem('BGLineData');
      // localStorage.removeItem('BGTrendData');
      // localStorage.removeItem('BPTrendData');
      // localStorage.removeItem('BGAdherenceData');
      // localStorage.removeItem('BPAdherenceData');
      // localStorage.removeItem('auth');
      // localStorage.removeItem('baseResource');
      // localStorage.setItem('isLoggedIn', 'false');
      // this.dashbordStateService.setCurrentPageNo(1);
      // this.authSubject.next(null);
      // this.stateService.setBaseResource(null);
      // this.setIsLoggedIn(false);
    });
  }
  log_out() {
    return this.http
      .get<User>(
        `${environment.apiBaseUrl}/${environment.profile_service}/logoutSession`
      )
      .pipe(
        map((auth: User) => {
          return auth;
        })
      );
  }
  checkIfEmailIdExists(emailId: string): Observable<ValidationEmail> {
    return this.http
      .get<Observable<ValidationEmail>>(
        `${this.apiBaseUrl}/${environment.profile_service}/${this.baseResourceUrl}/checkEmailId/${emailId}`
      )
      .pipe(
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  // resetPassword(val){
  //   return this.http.put<any>(`${this.apiBaseUrl}/resetPassword`,val)
  //   .pipe(map(data => {
  //     return data;
  //   }));
  // }
}
