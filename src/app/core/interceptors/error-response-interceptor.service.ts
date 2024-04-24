import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { SnackbarService } from '../services/snackbar.service';
@Injectable({ providedIn: 'root' })
export class HttpErrorInterceptor implements HttpInterceptor {
  routeUrl: any;
  checkSession = false;
  z;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialogRef: MatDialog,
    private snackbar: SnackbarService,
    private sharedService: CaregiverSharedService
  ) {
    this.routeUrl = this.route.snapshot['_routerState'].url;
    sharedService.loggedIn.subscribe((res) => {
      if (res) {
        this.checkSession = false;
      }
    });
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = {};
        if (error.error instanceof ErrorEvent) {
          //
          errorMsg = `Error: ${error.error.message}`;
        } else {
          //' session expired please login again'-- space before session text is written because from backend ,error message is coming with space
          if (
            error.status === 403 &&
            error.error.message == ' session expired please login again'
          ) {
            localStorage.setItem('sessionExpired', JSON.stringify(true));

            if (this.checkSession === false) {
              localStorage.clear();
              this.router.navigate(['/login']);
              this.dialogRef.closeAll();
              this.snackbar.error('Session Expired!');
              this.checkSession = true;
            }
            //' session expired please login again'-- space before session text is written because from backend ,error message is coming with space
          } else if (
            error.status === 403 &&
            error.error.message !== ' session expired please login again'
          ) {
            this.dialogRef.closeAll();
            this.snackbar.error(error.error.message);
          } else if (error.status === 503) {
            this.snackbar.error('User service unavailable');
          } else if (error.status === 500) {
            this.snackbar.error('Internal Server Error');
          } else if (error.status === 401) {
            if (error.error.message.includes('Invalid credentials')) {
              this.snackbar.error(error.error.message);
            }
            localStorage.setItem('sessionExpired', JSON.stringify(true));
            this.router.navigate(['/login']);
            localStorage.clear();
            this.dialogRef.closeAll();
          } else if (error.status === 400) {
            if (
              error.error.message &&
              !error.error.message.includes('already assigned') &&
              !error.error.message.includes('another call')
            ) {
              this.snackbar.error(error.error.message);
            } else if (!error.error.message) {
              let valueToExtract = null;
              for (const key in error.error) {
                if (error.error.hasOwnProperty(key)) {
                  valueToExtract = error.error[key];
                  break; // Stop after finding the first property
                }
              }
              this.snackbar.error(valueToExtract);
            }
          } else if (error.status === 404) {
            this.snackbar.error(error.error.message);
          }
          errorMsg = { err: error.status, message: error.error.message };
        }
        return throwError(errorMsg);
      })
    );
  }
}
