import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weight',
})
export class WeightPipe implements PipeTransform {
  transform(value: number, unit: string, defaultUnit: string): string | null {
    if (value && !NaN) {
      if (unit === 'kg' && unit !== defaultUnit) {
        return (Number(value) / 2.2).toFixed(1);
      }

      if (unit === 'lbs' && unit !== defaultUnit) {
        return (Number(value)).toFixed(1);
      }
      return value.toString();
    } else {
      return null;
    }
  } 
}
