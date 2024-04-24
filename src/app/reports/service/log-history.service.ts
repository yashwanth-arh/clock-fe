import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from './../../core/services/auth-state.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogHistoryService {
  public apiBaseUrl: string;
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
  getLoggedInList(pageNumber = 0, pageSize = 10, search): any {
    // let sortStr = `${sortColumn},${sortDirection}`;
    const url = 'getAllLoginDetails';
    const searchUrl = `getAllLoginDetails?searchQuery=${search}`;
    if (search) {
      return this.http
        .get<any>(`${this.apiBaseUrl}/${searchUrl}`, {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
          // .set('sort', sortStr),
        })
        .pipe(
          map((res) => {
            return res;
          })
        );
    } else {
      return this.http
        .get<any>(`${this.apiBaseUrl}/${url}`, {
          params: new HttpParams()
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString()),
          // .set('sort', sortStr),
        })
        .pipe(
          map((res) => {
            return res;
          })
        );
    }
  }
  // getLoggedInLists(pageNumber = 0, pageSize = 10, search): any {
  //   // let sortStr = `${sortColumn},${sortDirection}`;
  //   return this.http.get<any>(`${this.apiBaseUrl}/getAllLoginDetails?searchQuery=${search}`, {
  //     params: new HttpParams()
  //       .set('page', pageNumber.toString())
  //       .set('size', pageSize.toString())
  //     // .set('sort', sortStr),

  //   })
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }
}
