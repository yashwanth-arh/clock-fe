import { AbstractControl, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { BranchService } from 'src/app/branches/branch/branch.service';
import { DoctorService } from 'src/app/doctor-management/service/doctor.service';
import { HospitalManagementService } from 'src/app/hospital-management/service/hospital-management.service';
import {
  ClinicNPIValidation,
  PracticeNPIValidation,
  ProviderNPIValidation,
} from 'src/app/shared/entities/npi-validation';
import { AuthService } from '../services/auth.service';

export class NPINotTaken {
  static createPracticeNPIValidator(
    hospitalService: HospitalManagementService
  ): any {
    let practiceNPIExists;
    return (control: AbstractControl) => {
      return hospitalService.checkIfPracticeNPIExists(control.value).pipe(
        map((res: PracticeNPIValidation) => {
          return !res.success ? { hospitalNPITaken: true } : null;
        })
      );
    };
  }

  static createProviderNPIValidator(doctorService: DoctorService): any {
    return (control: AbstractControl) => {
      return doctorService.checkIfProvderNPIExists(control.value).pipe(
        map((res: ProviderNPIValidation) => {
          return res['success'] === false ? { docNPITaken: true } : null;
        })
      );
    };
  }

  static createClinicNPIValidator(branchService: BranchService): any {
    return (control: AbstractControl) => {
      return branchService
        .checkIfClinicNPIExists(control.value)
        .pipe(
          map((res: ClinicNPIValidation) =>
            !res.success ? { clinicNPITaken: true } : null
          )
        );
    };
  }
}
