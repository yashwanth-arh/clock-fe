import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { UserPermission } from 'src/app/shared/entities/user-permission.enum';
import { Auth } from 'src/app/shared/models/auth.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {      
    const permissions: UserPermission = route.data.permissionAllowed;
    if (permissions) {
      return this.authService.user.pipe(
        filter(user => !!user),
        take(1),
        map(user => this.handleRouteActivation(user, permissions))
      );
    } else {
      return true;
    }
  }
  private handleRouteActivation(user: Auth, permissionAllowed: UserPermission): boolean {
    const isAllowed: boolean = user.userDetails.permissions && user.userDetails.permissions.includes(permissionAllowed);
    if (!isAllowed) {
      this.router.navigate(['/login']);
    }
    return isAllowed;
  }

}
