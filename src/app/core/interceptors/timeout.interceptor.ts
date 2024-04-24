import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { empty, Observable, of, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { SnackbarService } from '../services/snackbar.service';
import { ApiTimeoutService } from '../services/api-timeout.service';
export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');
@Injectable({
  providedIn: 'root'
})
export class TimeoutInterceptor implements HttpInterceptor {

  constructor(
    private snackBarService: SnackbarService,
    private apiTimeoutService: ApiTimeoutService,
    @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const modifiedTimeout = request.clone({
      setHeaders: { 'X-Request-Timeout': `${this.defaultTimeout}` }
    });
    return next.handle(modifiedTimeout).pipe(
      timeout(this.defaultTimeout),
      catchError(err => {
        if (err instanceof TimeoutError) {
          this.apiTimeoutService.setIsTimedOut(true);
          this.apiTimeoutService.incrementFailedCount();
          return empty();
        }
        return of(err);
      })
    );
  }
}
