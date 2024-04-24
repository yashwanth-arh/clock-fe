import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const authorized = this.authService.authData;

    if (state.url.includes('/trend-graph')) {
      // Allow access to the route
      return true;
    }
    if (authorized) {
      return true;
    }
    localStorage.setItem('returnUrl', state.url);
    this.router.navigate([''], {
      queryParams: { returnUrl: state.url },
      queryParamsHandling: 'merge',
    });
    return false;
  }
}
