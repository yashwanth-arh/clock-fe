import { UserPermission } from './user-permission.enum';

export const UserPermissionGroups: { [key: string]: any } = {
  SUPER_ADMIN: {
    permissions: [
      UserPermission.HAS_HOSPITAL_PAGE,
      // UserPermission.HAS_BRANCH_PAGE,
      // UserPermission.HAS_CLAIMS_PAGE,
      // UserPermission.HAS_CPT_PAGE,
      UserPermission.HAS_DASHBOARDS,
      UserPermission.HAS_DEVICE_PAGE,
      UserPermission.HAS_DEVICE_TYPE_PAGE,
      UserPermission.HAS_DISEASES_PAGE,
      // UserPermission.HAS_ENROLLMENT_PAGE,
      // UserPermission.HAS_PROVIDER_PAGE,
      UserPermission.HAS_REPORTS,
      UserPermission.HAS_SETTINGS_MODULE,
      // UserPermission.CAN_ADD_PATIENT,
      // UserPermission.CAN_ADD_PROVIDER,
      UserPermission.CAN_ADD_DEVICE_TO_PATIENT,
      // UserPermission.HAS_PATIENT_REPORT_PAGE,
      // UserPermission.HAS_TICKETS_PAGE
    ],
  },
  RPM_ADMIN: {
    permissions: [
      UserPermission.HAS_HOSPITAL_PAGE,
      // UserPermission.HAS_BRANCH_PAGE,
      // UserPermission.HAS_CPT_PAGE,
      UserPermission.HAS_DASHBOARDS,
      UserPermission.HAS_DEVICE_PAGE,
      UserPermission.HAS_DEVICE_TYPE_PAGE,
      // UserPermission.HAS_DISEASES_PAGE,
      // UserPermission.HAS_ENROLLMENT_PAGE,
      // UserPermission.HAS_PROVIDER_PAGE,
      UserPermission.HAS_REPORTS,
      UserPermission.HAS_SETTINGS_MODULE,
      // UserPermission.CAN_ADD_PATIENT,
      // UserPermission.CAN_ADD_DEVICE_TO_PATIENT,
      // UserPermission.HAS_PATIENT_REPORT_PAGE,
      // UserPermission.HAS_TICKETS_PAGE,
      // UserPermission.HAS_CAREGIVER_PAGE,
      // UserPermission.CAN_ADD_PROVIDER,
    ],
  },
  HOSPITAL_USER: {
    permissions: [
      UserPermission.HAS_DEVICE_PAGE,
      UserPermission.HAS_BRANCH_PAGE,
      UserPermission.HAS_DASHBOARDS,
      UserPermission.HAS_ENROLLMENT_PAGE,
      UserPermission.HAS_PROVIDER_PAGE,
      UserPermission.CAN_ADD_PATIENT,
      UserPermission.CAN_ADD_DEVICE_TO_PATIENT,
      UserPermission.HAS_CAREGIVER_PAGE,
      UserPermission.CAN_ADD_PROVIDER,
      UserPermission.HAS_CLAIMS_PAGE,
    ],
  },
  FACILITY_USER: {
    permissions: [
      UserPermission.HAS_DASHBOARDS,
      UserPermission.HAS_ENROLLMENT_PAGE,
      UserPermission.HAS_PROVIDER_PAGE,
      UserPermission.HAS_CLAIMS_PAGE,
      UserPermission.CAN_ADD_PATIENT,
      UserPermission.CAN_ADD_DEVICE_TO_PATIENT,
      UserPermission.HAS_CAREGIVER_PAGE,
      UserPermission.CAN_ADD_PROVIDER,
      UserPermission.HAS_DEVICE_PAGE,
    ],
  },
  DOCTOR: {
    permissions: [UserPermission.HAS_DOCTOR_DASHBOARD],
  },
  CAREPROVIDER: {
    permissions: [UserPermission.HAS_CAREGIVER_DASHBOARD],
  },
  PATIENT: {
    permissions: [UserPermission.HAS_REPORTS, UserPermission.HAS_DASHBOARDS],
  },
};
