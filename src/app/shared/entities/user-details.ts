import { UserPermission } from './user-permission.enum';
import { UserRoles } from './user-roles.enum';

export type Roles = 'RPM_ADMIN' | 'hospital_USER' | 'BRANCH_USER' | 'PATIENT';
export type Status = 'ACTIVE' | 'INACTIVE';

export interface UserDetails {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  userRole: UserRoles;
  userStatus: Status;
  sessionId: string;
  permissions?: UserPermission[];
}
