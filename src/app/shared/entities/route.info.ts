import { UserPermission } from './user-permission.enum';

export interface ROUTEINFO {
  actionName?: string;
  breadcrumb?: string;
  preload?: string;
  title?: string;
  showActionBtn?: boolean;
  showReturnBtn?: boolean;
  showSideNav?: boolean;
  showDatePicker?: boolean;
  permissionAllowed?: UserPermission;
  showBtnName?: boolean;
  buttonName?: string;
  // setting actions
  actionNameHospital?: string;
  actionNameDoctor?: string;
  actionNameSpecilitiy?: string;
  actionNameICD?: string;
  actionCoordinator?:string;
}
