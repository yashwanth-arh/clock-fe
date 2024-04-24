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
export class CheckOsType implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const user = this.authService.authData;
    const isLoggedIn = user && user.jwtToken;
    const ostype = localStorage.getItem('osType');
    request = request.clone({
        setHeaders: {
          osType: `${ostype}`
        }
      });
    return next.handle(request);
  }
}
