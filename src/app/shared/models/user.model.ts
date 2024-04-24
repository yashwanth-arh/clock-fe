import { UserDetails } from '../entities/user-details';
import { UserPermission } from '../entities/user-permission.enum';
import { UserRoles } from '../entities/user-roles.enum';

export class User {
  jwtToken?: string;
  sessionId?: string;
  userDetails?: UserDetails;
  baseResourcePath?: string;

  constructor(json: any) {
    Object.assign(this, json);
  }

  get privilegedRoles(): string[] {
    return [UserRoles.SUPER_ADMIN, UserRoles.RPM_ADMIN];
  }

  isActionAllowed(action: UserPermission): boolean {
    return this.userDetails?.permissions && this.userDetails?.permissions.length && this.userDetails?.permissions.includes(action);
  }

  get isPrivileged(): boolean {
    return this.privilegedRoles.indexOf(this.userDetails.userRole) > -1;
  }
}
