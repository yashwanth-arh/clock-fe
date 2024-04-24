import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ContentMarketing {
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

  statusChange(key: string, id): any {
    return this.http
      .put<any>(`${this.apiBaseUrl}/updateContentStatus/${id}/${key}`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getAllContentHospitalList(pageNo, pageSize, status, search) {
    if (status && search) {
      return this.http
        .get<any>(
          `${this.apiBaseUrl}/getAllContentList?searchQuery=${search}&status=${status}&page=${pageNo}&size=${pageSize}`
        )
        .pipe(
          map((res) => {
            return res;
          })
        );
    } else if (status && !search) {
      return this.http
        .get<any>(
          `${this.apiBaseUrl}/getAllContentList?status=${status}&page=${pageNo}&size=${pageSize}`
        )
        .pipe(
          map((res) => {
            return res;
          })
        );
    } else if (search && !status) {
      return this.http
        .get<any>(
          `${this.apiBaseUrl}/getAllContentList?searchQuery=${search}&page=${pageNo}&size=${pageSize}`
        )
        .pipe(
          map((res) => {
            return res;
          })
        );
    } else {
      return this.http
        .get<any>(
          `${this.apiBaseUrl}/getAllContentList?page=${pageNo}&size=${pageSize}`
        )
        .pipe(
          map((res) => {
            return res;
          })
        );
    }
  }
  getAllContentFacilityList() {
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllContentFacilityList`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getAllContentList() {
    return this.http.get<any>(`${this.apiBaseUrl}/getAllContentList`).pipe(
      map((res) => {
        return res;
      })
    );
  }
  createContent(body) {
    return this.http.post<any>(`${this.apiBaseUrl}/createContent`, body).pipe(
      map((res) => {
        return res;
      })
    );
  }
  updateContent(body, contentId) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/updateContent/${contentId}`, body)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  updateContentStatus(contentId, status) {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/updateContentStatus/${contentId}/${status}`,
        {}
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  deleteContent(contentId) {
    return this.http
      .delete<any>(`${this.apiBaseUrl}/deleteContent/${contentId}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getAllSpecialty(
    pageNumber = 0,
    pageSize,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchQuery = null
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
      .set('size', pageSize.toString())
      .set('sort', sortDirection);

    if (searchQuery != null && searchQuery != '') {
      params = params.set('searchQuery', searchQuery);
    }
    return this.http
      .get<any>(`${this.apiBaseUrl}/getAllSpecialties`, { params })
      .pipe(
        map((speciality) => {
          return speciality;
        })
      );
  }

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
  downloadContentMarketingFiles(fileDownloadUrl) {
    return this.http
      .get<Blob>(
        `${environment.apiBaseUrl}/${environment.data_service}/downloadFile?keyName=${fileDownloadUrl}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
