import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'height',
})
export class HeightPipe implements PipeTransform {
  transform(value: number, unit: string, defaultUnit: string): string | null {
    if (value && !NaN) {
      if (unit === 'inches' && unit !== defaultUnit) {
        return (Number(value) * 0.3937).toFixed(1);
      }

      if (unit === 'cms' && unit !== defaultUnit) {
        return (Number(value) * 0.3937).toFixed(1);
      }
      // cm to inches value * 0.3937
      //inches to cm value * 2.54
      return value.toString();
    } else {
      return null;
    }
  }
}
