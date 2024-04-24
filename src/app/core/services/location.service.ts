import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private baseURL = 'assets/json/country-code.json';
  private cityBaseURL = 'assets/json/city.json';

  constructor(private http: HttpClient) { }


  getJSONData(): any {
    return this.http.get(this.baseURL);
  }

  getFilteredJSONData(): any {
    return this.http.get(this.baseURL)
  }

  getStates(): Observable<string[]> {
    return this.http.get(this.baseURL).pipe(
      map(res => Object.keys(res))
    );
  }

  getCities(val: string): Observable<any> {
    return this.http.get(this.cityBaseURL).pipe(
      map((res: Array<any>) => res.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) > -1))
    );
  }

}
