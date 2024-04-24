export interface PracticeNPIValidation {
  practiceNPIExists: boolean;
  message: string;
  status: string;
  success: boolean;
}

export interface ProviderNPIValidation {
  error: string;
  message: string;
  status: string;
  success: boolean;
}

export interface ClinicNPIValidation {
  clinicNPIExists: boolean;
  message: string;
  status: string;
  success: boolean;
}
