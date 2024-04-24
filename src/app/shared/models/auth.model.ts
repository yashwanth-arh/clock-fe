import { UserDetails } from '../entities/user-details';

export class Auth {
  jwtToken?: string;
  sessionId?: string;
  userDetails?: UserDetails;
  baseResourcePath?: string;
}
