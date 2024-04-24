import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Token } from 'src/app/shared/models/jwt.token.model';
import { AuthService } from '../services/auth.service';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate {
  isExpired: boolean;
  value: Token;
  constructor(
    private router: Router,
    private authService: AuthService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.isExpired = this.CheckTokenExpiry();
    if (this.isExpired) {
      this.authService.logout();
      this.router.navigate([''], { queryParams: { returnUrl: state.url }, queryParamsHandling: 'merge' });
      return false;
    }
    else {
      return true;
    }
  }

  CheckTokenExpiry(): boolean {
    const authorized = this.authService.authData;
    if (authorized.jwtToken) {
      this.value = this.getDecodedAccessToken(authorized.jwtToken);
      const seconds = new Date().getTime();
      const expiresAt = this.value.exp * 1000;
      if (seconds > expiresAt) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    }
    catch (Error) {
      return null;
    }
  }
}
