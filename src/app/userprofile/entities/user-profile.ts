import { Address } from 'src/app/patient-management/entities/patient';

export interface Profile {
  'userProfile': {
    'address'?: Address;
    'name'?: string | null;
    'homeNumber'?: string;
    'cellNumber'?: string;
  };
}

export interface ResetPassword {
  'existingPassword'?: string | null;
  'newPassword'?: string | null;
}


