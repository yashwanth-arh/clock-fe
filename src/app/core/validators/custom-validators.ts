import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

export function confirmControlValidatorAsync(controlNameToCompare: string): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const controlToCompare = control.root.get(controlNameToCompare);
    if (control.value == null || control.value.length === 0) {
      return of(null);
    } else {
      return control.valueChanges.pipe(
        take(1),
        switchMap((value: string) => {
          if (value) {
            return of(value === controlToCompare.value);
          } else {
            return of(null);
          }
        })
        ,
        map((value: boolean) => (value ? null : { NoMatch: true }))
      );
    }
  };
}

export function noSpaceValidation({ value }: AbstractControl): ValidationErrors {
  if (!value) {
    return {
      trimError: { value: 'Control has no value' }
    };
  }
  if (value.startsWith(' ')) {
    return {
      trimError: { value: 'Control has leading whitespace' }
    };
  }
  if (value.endsWith(' ')) {
    return {
      trimError: { value: 'Control has trailing whitespace' }
    };
  }
  return null;
}
