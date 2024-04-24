import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class BranchUserService {
  public omitIgnoreCase = ['createdAt', 'contactNumber', 'lastUpdatedAt'];
  public apiBaseUrl: string;
  public ignorecase = '';
  public iheathApi: string;
  public uniqueUrl: string;
  public baseResource: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authStateService: AuthStateService
  ) {
    this.authStateService.baseResource.subscribe((res) => {
      this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      this.apiBaseUrl += `/${res}`;
      this.uniqueUrl = environment.uniqueUrl;
      this.iheathApi = this.authService.generateBaseUrl('PROFILE', false);
      this.authStateService.baseResource.subscribe((res) => {
        this.baseResource = res;
      });
    });
  }

  getAllBranchUser(
    pageNumber,
    pageSize,
    branchUserId,
    sortColumn = 'createdAt',
    sortDirection = 'desc',
    searchData
  ): any {
    // const sort = `${sortColumn},${sortDirection}`;
    let sortStr = `${sortColumn},${sortDirection}`;
    if (!this.omitIgnoreCase.includes(sortColumn)) {
      sortStr += ',ignorecase';
    }
    // ${
    //   searchData?.searchQuery
    //     ? `searchQuery=${searchData.searchQuery}`
    //     : searchData?.status
    //     ? `status=${searchData.status}`
    //     : 'status='
    //     ? searchData
    //     : 'searchQuery='
    // }
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/facilityUsers?facilityId=${branchUserId}&${
          searchData ? searchData : ''
        }`,
        {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
          // .set('sort', sortStr),
        }
      )
      .pipe(
        map((branchUser) => {
          return branchUser;
        })
      );
  }

  addBranchUser(params: any) {
    return this.http.post<any>(`${this.apiBaseUrl}/facilityUsers`, params).pipe(
      map((res) => {
        return res;
      })
    );
  }
  // adminFacilityAccess(FacilityId: any): any {
  //   return this.http
  //     // `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/getAllIcdCodes?searchQuery=${val}`
  //     .put<any>(`${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResource}/facilityUsers/${FacilityId}`, {})
  //     .pipe(
  //       map((res) => {
  //         return res;
  //       })
  //     );
  // }
  editBranchUser(branchUserId, params: any) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/facilityUsers/${branchUserId}`, params)
      .pipe(map(() => {}));
  }
  updateFacilityUserStatus(facilityId: any, params: any): any {
    return this.http
      .put<any>(
        `${this.apiBaseUrl}/facilityUsers/${facilityId}/status/${params}`,
        {}
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
