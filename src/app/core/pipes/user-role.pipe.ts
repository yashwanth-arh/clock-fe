import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userRole'
})
export class UserRolePipe implements PipeTransform {

  transform(value: string, ...args: any[]): string {
    let role = value;
    switch (value.toLowerCase()) {
      case 'doctor':
        role = 'CARE PROVIDER';
        break;
      case 'rpm_admin':
        role = 'SUPER ADMIN';
        break;
      case 'hospital_user':
        role = 'PRACTICE ADMIN';
        break;
      case 'branch_user':
        role = 'CLINIC ADMIN';
        break;
      case 'biller':
        role = 'BILLER';
        break;
      default:
        role = value;
        break;
    }

    return role.toUpperCase();
  }

}
