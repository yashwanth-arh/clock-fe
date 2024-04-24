export interface Patient {
  'version'?: number;
  'createdAt'?: string | null;
  'createdBy'?: string | null;
  'lastUpdatedAt'?: string | null;
  'lastUpdatedBy'?: string | null;
  'id': string;
  'firstName': string;
  'middleName'?: string | null;
  'lastName'?: string | null;
  'dob'?: string | null;
  'age'?: number | null;
  'gender'?: string | null;
  'contactType'?: string | null;
  'contactNumber'?: string | null;
  'emailId'?: string | null;
  'address'?: Address;
  'bmi'?: string | null;
  'flag'?: boolean | null;
  'primaryicdcode'?: string;
  'secondaryicdcode'?: string;
  'primaryPhysician'?: {
    'id': string | null;
  };
  'consentFormExists':boolean;
  'personalEmail'?: string;
  'userStatus'?: string | null;
  'secondaryPhysician'?: string | null;
  'branch'?: {
    'hospital'?: {
      'id': string | null;
    },
    'id': string | null;
  };
  'hospital'?: string | null;
  'dryWeight'?: string | null;
  'care65Email'?: string | null;
  'diagnosisCodes'?: string | null;
  'primaryDiagnosis'?: string | null;
  'secondaryDiagnosis'?: string | null;
  'insurenceType'?: string | null;
  'homeNumber'?: string | null;
  'hba1c'?: string | null;
  'hdlLevels'?: string | null;
  'ldlLevels'?: string | null;
  'cholestralLevels'?: string | null;
  'trilycerideLevels'?: string | null;
  'randomSugar'?: string | null;
  'fastingSugar'?: string | null;
  'postPrandial'?: string | null;
  'cellNumber'?: string | null;
  'state'?: string | null;
  'city'?: string | null;
  'systolicBloodPressure'?: string | null;
  'diastolicBloodPressure'?: string | null;
  'lastDialysisDate'?: string | null;
  'nextDialysisDate'?: string | null;
}

export interface PatientResponse {
  content?: Patient[];
  totalElements?: number;
  numberOfElements?: number;
}

export interface PatientRegistrationURL {
  loginUrl?: string;
  registrationUrl?: string;
}

export interface Address {
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
}