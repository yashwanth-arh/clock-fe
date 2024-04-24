import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { ClinicNPIValidation } from 'src/app/shared/entities/npi-validation';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class LeadershipBoardService {
  public apiBaseUrl: string;
  public ignorecase = '';
  public baseResourceUrl: string;
  public omitIgnoreCase = [
    'createdAt',
    'name',
    'contactNumber',
    'emailId',
    'address.addressLine',
    'address.state',
    'address.city',
    'practiceNPI',
    'status',
  ];
  public xpSubject!: BehaviorSubject<{}>;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authStateService: AuthStateService
  ) {
    this.authStateService.baseResource.subscribe((res) => {
      this.baseResourceUrl = res;
    });
    this.xpSubject = new BehaviorSubject<any>({});
  }

  getLeadershipBoardList(pageNumber = 0, pageSize = 10, sort, search): any {
    // if (!this.omitIgnoreCase.includes(sortColumn)) {
    //   sortStr += ',ignorecase';
    // }
    if (search) {
      return this.http
        .get<any>(
          `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResourceUrl}/getAllPatientsExperience?searchQuery=${search}&page=${pageNumber}&size=${pageSize}`,
          {
            // params: new HttpParams()
            //   .set('page', pageNumber.toString())
            //   .set('size', pageSize.toString())
            //   .set('sort', sort),
          }
        )
        .pipe(
          map((data) => {
            return data;
          })
        );
    } else {
      return this.http
        .get<any>(
          `${environment.apiBaseUrl}/${environment.profile_service}/${this.baseResourceUrl}/getAllPatientsExperience`,
          {
            params: new HttpParams()
              .set('page', pageNumber.toString())
              .set('size', pageSize.toString()),
            // .set('sort', sort),
          }
        )
        .pipe(
          map((data) => {
            return data;
          })
        );
    }
  }
  getLeadershipBoardListById(
    id,
    body,
    pageNumber: number,
    pageSize: number
  ): any {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResourceUrl}/getAllPatientsExperience/${id}?page=${pageNumber}&size=${pageSize}`,
        body
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  setXp(value) {
    this.xpSubject.next(value);
  }
  get $experiencePoints(): Observable<any> {
    return this.xpSubject.asObservable();
  }
}
