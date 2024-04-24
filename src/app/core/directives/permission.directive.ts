import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { UserPermission } from 'src/app/shared/entities/user-permission.enum';
import { Auth } from 'src/app/shared/models/auth.model';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit, OnDestroy {
  @Input() appPermission: UserPermission;
  private userPermissionsSubscription: Subscription;

  constructor(
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
    private templateRef: TemplateRef<any>
  ) { }

  ngOnInit(): void {
    this.viewContainer.clear();
    this.userPermissionsSubscription = this.authService.user.pipe(
      filter(user => !!user),
      map((user: Auth) => user.userDetails.permissions || []),
      map(permissions => permissions.some(permission => permission === this.appPermission)),
      tap(() => this.viewContainer.clear())
    ).subscribe(res => this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: res }));
  }

  ngOnDestroy(): void {
    if (this.userPermissionsSubscription) {
      this.userPermissionsSubscription.unsubscribe();
    }
  }

}
