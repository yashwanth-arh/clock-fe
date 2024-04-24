import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const user = this.authService.authData;
    const isLoggedIn = user && user.jwtToken;

    const isApiUrl = request.url.startsWith(environment.apiBaseUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.jwtToken}`,
          sessionId: `${user.sessionId}`
        }
      });
      return next.handle(request);

    }
    //${this.uniqueUrl}/checkTokenValid?key=089c7dda-2577-4402-9dbe-09b50519ac67    
    if (request.url.endsWith('authenticate') || request.url.includes('forgotPassword') || request.url.includes('checkTokenValid') || request.url.includes('updatePassword')) {
      return next.handle(request);
    }

    return null;
  }
}
