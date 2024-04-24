import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ValidationEmail } from 'src/app/shared/entities/validation-email';
import { AuthService } from '../services/auth.service';

export class EmailNotTaken {
  static createValidator(authService: AuthService): any {
    return (control: AbstractControl) => {
      return authService
        .checkIfEmailIdExists(control.value)
        .pipe(
          map((res: ValidationEmail) =>
            !res.success
              ? { emailTaken: true, emailErrorMsg: res.message }
              : null
          )
        );
    };
  }
}
