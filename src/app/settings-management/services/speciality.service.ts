import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
@Injectable({
  providedIn: 'root',
})
export class SpecialityService {
  public omitIgnoreCase = ['createdAt'];
  public apiBaseUrl: string;
  public ignorecase = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private authStateService: AuthStateService
  ) {
    this.authStateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
    });
  }

  getAllSpecialty(
    pageNumber = 0,
    pageSize,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchQuery
  ): any {
    if (pageSize <= 10) {
      pageSize =
        screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
    }
    sortDirection = sortDirection === '' ? 'desc' : sortDirection;
    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortDirection += '';
    }
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());
    // .set('sort', sortDirection);

    // if (searchQuery != null && searchQuery != '') {
    //   params = params.set('searchQuery', searchQuery);
    // }
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/getAllSpecialties?${
          searchQuery ? searchQuery : ''
        }`,
        { params }
      )
      .pipe(
        map((speciality) => {
          return speciality;
        })
      );
  }

  // getAllSpecialty(
  //   pageNumber = 0,
  //   pageSize,
  //   sortColumn = 'createdAt',
  //   sortDirection = 'desc',
  //   searchQuery = null
  // ): any {
  //   if (pageSize <= 10) {
  //     pageSize =
  //       screen.availWidth >= 1920 && screen.availHeight >= 1080 ? 15 : 10;
  //   }
  //   sortDirection = sortDirection === '' ? 'desc' : sortDirection;
  //   if (!this.omitIgnoreCase.includes(sortColumn)) {
  //     sortDirection += '';
  //   }
  //   let params = new HttpParams()
  //     .set('page', pageNumber.toString())
  //     .set('size', pageSize.toString())
  //     .set('sort', sortDirection);

  //   if (searchQuery != null && searchQuery != '') {
  //     params = params.set('searchQuery', searchQuery);
  //   }
  //   return this.http
  //     .get<any>(`${this.apiBaseUrl}/doctors/specialties`, { params })
  //     .pipe(
  //       map((speciality) => {
  //         return speciality;
  //       })
  //     );
  // }

  addSpecialty(params: any) {
    return this.http
      .post<any>(`${this.apiBaseUrl}/addNewSpecialties`, params)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  editSpecialty(specialityId, params) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/updateSpecialties/${specialityId}`, params)
      .pipe(
        map((Data) => {
          return Data;
        })
      );
  }
  changeSpecialitiesStatus(specialityId, status) {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/changeSpecialitiesStatus/${specialityId}/${status}`,
        {}
      )
      .pipe(
        map((Data) => {
          return Data;
        })
      );
  }
}
