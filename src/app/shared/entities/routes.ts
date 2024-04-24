import { UserPermission } from './user-permission.enum';

export interface ROUTE {
  icon?: string;
  activeImg?:string;
  inActiveImg?:string;
  route?: string;
  title?: string;
  subMenu?: ROUTE[];
  permissions?: UserPermission;
}

export const emailRx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const phoneNumberRx = /^(?!0+$)\d{10,}$/;
export const aadhaarNumberRx = /^(?!0+$)\d{12}$/;

export const maskRx = '(000) 000-0000';
export const ssnRx = '000-000-000';
// export const maskRx = '0000000000'
