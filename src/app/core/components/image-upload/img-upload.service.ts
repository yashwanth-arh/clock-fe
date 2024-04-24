import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserProfileResponse } from 'src/app/shared/entities/user-profile';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ImgUploadService {
  public apiBaseUrl: string;
  public profilePhoto = new BehaviorSubject<SafeResourceUrl>('');

  constructor(
    private http: HttpClient,
    private stateService: AuthStateService,
    private authService: AuthService
  ) {
    this.stateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }

  public uploadImage(image: File): Observable<Object> {
    const formData = new FormData();
    formData.append('avatar', image);
    return this.http.put(`${this.apiBaseUrl}/profile/image`, formData);
  }

  public getProfileData(): Observable<UserProfileResponse | any> {
    return this.http
      .get<Observable<UserProfileResponse | any>>(
        `${this.apiBaseUrl}/getProfileDetails`
      )
      .pipe(
        map((data) => data),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  /** Setting profile image when edit profile toggles */
  setProfileImage(value: SafeResourceUrl): void {
    this.profilePhoto.next(value);
  }

  get profileImage(): Observable<SafeResourceUrl> {
    return this.profilePhoto.asObservable();
  }
}
