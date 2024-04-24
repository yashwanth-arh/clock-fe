import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private baseResourcePath: BehaviorSubject<string | null>;
  private isUserLoggedIn: BehaviorSubject<boolean | null>;
  private userRole: BehaviorSubject<string | null>;
  constructor() {
    // let inputString = localStorage.getItem('baseResource');
    // if (inputString.startsWith('/')) {
    //   inputString = inputString.substring(1);

    // }
    this.baseResourcePath = new BehaviorSubject<string | null>(
      localStorage.getItem('baseResource')
    );

    this.isUserLoggedIn = new BehaviorSubject<boolean | null>(
      JSON.parse(localStorage.getItem('isLoggedIn'))
    );
    this.userRole = new BehaviorSubject<string | null>(
      localStorage.getItem('role')
    );
  }

  setBaseResource(value: string | null): void {
    this.baseResourcePath.next(value);
    // let inputString = value;
    // if (inputString.startsWith('/')) {
    //   inputString = inputString.substring(1);
    //   localStorage.setItem('baseResource', inputString);
    // }
  }

  get baseResource(): Observable<string> {
    return this.baseResourcePath.asObservable();
  }

  setUserLoggedIn(value: boolean): void {
    this.isUserLoggedIn.next(value);
    localStorage.setItem('isLoggedIn', String(value));
  }

  get userLoggedIn(): Observable<boolean | null> {
    return this.isUserLoggedIn.asObservable();
  }

  get role(): Observable<string | null> {
    return this.userRole.asObservable();
  }

  setRole(value: string): void {
    this.userRole.next(value);
    localStorage.setItem('role', value);
  }
}
