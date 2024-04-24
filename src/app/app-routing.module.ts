import { DocDashboardComponent } from './doctor-dashboard/doc-dashboard/doc-dashboard.component';
import { PatientAccountActivationComponent } from './patient-account-activation/patient-account-activation.component';
import { CaregiverdashboardComponent } from './CareproviderDashboard/caregiverdashboard/caregiverdashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { PermissionsGuard } from './core/guards/permissions.guard';
import { UserPermission } from './shared/entities/user-permission.enum';
import { AccessDeniedComponent } from './core/components/access-denied/access-denied.component';
import { NavComponent } from './core/components/nav/nav.component';
import { CareproviderPatientListComponent } from './CareproviderDashboard/careprovider-patient-list/careprovider-patient-list.component';
import { TotalPatientsComponent } from './CommonComponents/total-patients/total-patients.component';
import { DoctorPatientsDetailsComponent } from './CommonComponents/doctor-patients-details/doctor-patients-details.component';
import { ResetPasswordComponent } from './userprofile/reset-password/reset-password.component';
import { UpdatePasswordComponent } from './dashboard/update-password/update-password.component';
import { PreviewImageComponent } from './CommonComponents/medication/preview-image/preview-image.component';
import { ReportsTemplateComponent } from './CommonComponents/reports-template/reports-template.component';
import { ActivationInfoPageComponent } from './core/components/activation-info-page/activation-info-page.component';
import { UserSupportComponent } from './userprofile/user-support/user-support.component';
import { SharedTrendGraphComponent } from './CommonComponents/dashboard-graphs/shared-trend-graph/shared-trend-graph.component';
import { PatientDeviceListComponent } from './patient-management/patient-device/patient-device-list/patient-device-list.component';
import { GuardiansComponent } from './CommonComponents/guardians/guardians.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: localStorage.getItem('auth')
      ? localStorage.getItem('url') === '/'
        ? 'login'
        : localStorage.getItem('url')
      : 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      preload: true,
      breadcrumb: 'Login',
    },
  },
  {
    path: 'trend-graph',
    component: SharedTrendGraphComponent,
    data: {
      preload: false,
      breadcrumb: 'Graph',
    },
  },

  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    data: {
      preload: false,
      breadcrumb: 'Reset Password',
    },
  },
  {
    path: 'activate-account',
    component: PatientAccountActivationComponent,
    data: {
      preload: false,
      breadcrumb: 'Patient Account Activation',
    },
  },
  {
    path: 'previewImage/:image',
    component: PreviewImageComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: {
      preload: true,
      breadcrumb: 'Forgot Password',
      showActionBtn: false,
    },
  },
  {
    path: 'activation-info',
    component: ActivationInfoPageComponent,
    data: {
      preload: true,
      breadcrumb: 'Activation Info',
      showActionBtn: false,
    },
  },
  {
    path: 'reports-template/:id',
    component: ReportsTemplateComponent,
    data: {
      preload: true,
      breadcrumb: 'Reports Template',
    },
  },

  {
    path: 'update-password',
    component: UpdatePasswordComponent,
    data: {
      preload: true,
      breadcrumb: 'Update Password',
      showActionBtn: false,
    },
  },
  {
    path: 'home',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      // {
      //   path: 'ihealth-patient-reg',
      //   component: IhealthPatientRegistrationComponent,
      //   canActivate: [AuthGuard],
      //   data: {
      //     preload: true,
      //     breadcrumb: 'ihealth patient registration',
      //   },
      // },
      // {
      //   path: 'settings/device-type',
      //   component: DeviceTypeListComponent,
      //   canActivate: [AuthGuard, PermissionsGuard],
      //   data: {
      //     preload: false,
      //     breadcrumb: 'device type list',
      //     actionName: 'Add Device Type',
      //     title: 'Device Types',
      //     showActionBtn: true,
      //     permissionAllowed: UserPermission.HAS_DEVICE_TYPE_PAGE,
      //   },
      //   children: [
      //     {
      //       path: 'add',
      //       component: DeviceTypeListComponent,
      //     },
      //     {
      //       path: 'edit',
      //       component: DeviceTypeListComponent,
      //     },
      //   ],
      // },
      // {
      //   path: 'settings/vendor-list',
      //   component: VendorsListComponent,
      //   canActivate: [AuthGuard, PermissionsGuard],
      //   data: {
      //     preload: false,
      //     breadcrumb: 'device type list',
      //     actionName: 'Add Vendor',
      //     title: 'Vendors',
      //     showActionBtn: true,
      //     permissionAllowed: UserPermission.HAS_DEVICE_TYPE_PAGE,
      //   },
      //   children: [
      //     {
      //       path: 'add',
      //       component: VendorsListComponent,
      //     },
      //     {
      //       path: 'edit',
      //       component: VendorsListComponent,
      //     },
      //   ],
      // },

      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard, PermissionsGuard],
        data: {
          preload: true,
          breadcrumb: 'dashboard',
          actionName: '',
          title: 'Dashboard',
          showActionBtn: false,
          permissionAllowed: UserPermission.HAS_DASHBOARDS,
        },
      },
      {
        path: 'profile',
        component: UserprofileComponent,
        canActivate: [AuthGuard],
        data: {
          preload: true,
          breadcrumb: 'User Profile',
          showActionBtn: false,
          title: 'User Profile',
        },
      },
      {
        path: 'patients',
        canActivate: [AuthGuard, PermissionsGuard],
        loadChildren: () =>
          import('./patient-management/patient-management.module').then(
            (mod) => mod.PatientManagementModule
          ),
        data: {
          preload: false,
          breadcrumb: 'Patient-Management',
          permissionAllowed: UserPermission.HAS_ENROLLMENT_PAGE,
        },
      },
      {
        path: 'hospitals',
        canActivate: [AuthGuard, PermissionsGuard],
        loadChildren: () =>
          import('./hospital-management/hospital-management.module').then(
            (mod) => mod.hospitalManagementModule
          ),
        data: {
          preload: false,
          breadcrumb: 'hospital',
          permissionAllowed: UserPermission.HAS_HOSPITAL_PAGE,
        },
      },
      {
        path: 'users',
        canActivate: [AuthGuard, PermissionsGuard],
        loadChildren: () =>
          import('./care-provider-management/care-provider.module').then(
            (mod) => mod.CareProviderManagementModule
          ),
        data: {
          preload: false,
          breadcrumb: 'Care Provider',
          permissionAllowed: UserPermission.HAS_PROVIDER_PAGE,
        },
      },
      {
        path: 'ch-admins',
        canActivate: [AuthGuard, PermissionsGuard],
        loadChildren: () =>
          import('./clock-health-admin/clock-health-admin.module').then(
            (mod) => mod.ClockHealthAdminModule
          ),
        data: {
          preload: false,
          breadcrumb: 'ClockHealth Admins',
          permissionAllowed: UserPermission.HAS_HOSPITAL_PAGE,
        },
      },
      {
        path: 'facilities',
        canActivate: [AuthGuard, PermissionsGuard],
        loadChildren: () =>
          import('./branches/branch/branch-module').then(
            (mod) => mod.BranchModule
          ),
        data: {
          preload: false,
          breadcrumb: 'Facilities',
          permissionAllowed: UserPermission.HAS_BRANCH_PAGE,
        },
      },
      {
        path: 'caregivers',
        canActivate: [AuthGuard, PermissionsGuard],
        loadChildren: () =>
          import('./caregiver/caregiver-module').then(
            (mod) => mod.CaregiverManagementModule
          ),
        data: {
          preload: false,
          breadcrumb: 'Caregivers',
          permissionAllowed: UserPermission.HAS_CAREGIVER_PAGE,
        },
      },
      {
        path: 'configuration',
        canActivate: [AuthGuard, PermissionsGuard],
        loadChildren: () =>
          import('./settings-management/settings-management.module').then(
            (mod) => mod.SettingsManagementModule
          ),
        data: {
          preload: false,
          breadcrumb: 'Settings',
        },
      },
      {
        path: 'devices',
        canActivate: [AuthGuard, PermissionsGuard],
        loadChildren: () =>
          import('./device-management/device-management.module').then(
            (mode) => mode.DeviceManagementModule
          ),
        data: {
          preload: true,
          breadcrumb: 'Device',
        },
      },
      {
        path: 'tickets',
        canActivate: [AuthGuard, PermissionsGuard],
        loadChildren: () =>
          import('./support-ticket/support-ticket.module').then(
            (mode) => mode.SupportTicketModule
          ),
        data: {
          preload: true,
          breadcrumb: 'Support Ticket',
          actionName: '',
          title: 'Issues',
          showActionBtn: false,
          permissionAllowed: UserPermission.HAS_DASHBOARDS,
        },
      },
      {
        path: 'leader-board',
        canActivate: [AuthGuard, PermissionsGuard],
        loadChildren: () =>
          import('./leadership-board/leadership-board.module').then(
            (mode) => mode.LeadershipBoardModule
          ),
        data: {
          preload: true,
          breadcrumb: 'Leadership Board',
        },
      },
      {
        path: 'content-marketing',
        canActivate: [AuthGuard, PermissionsGuard],
        loadChildren: () =>
          import('./content-marketing/content-marketing.module').then(
            (mode) => mode.ContentMarketingModule
          ),
        data: {
          preload: true,
          breadcrumb: 'content-marketing',
        },
      },
      {
        path: 'reports',
        canActivate: [AuthGuard, PermissionsGuard],
        loadChildren: () =>
          import('./reports/reports.module').then((mod) => mod.ReportModule),
        data: {
          preload: false,
          breadcrumb: 'Reports',
          permissionAllowed: UserPermission.HAS_REPORTS,
        },
      },

      {
        path: 'denied',
        canActivate: [AuthGuard],
        component: AccessDeniedComponent,
        data: {
          preload: false,
          breadcrumb: 'Access Denied',
          title: 'Access Denied',
        },
      },
    ],
  },
  // {
  //   path: 'caregiverDashboard',
  //   component: CaregiverdashboardComponent,
  //   canActivate: [AuthGuard, PermissionsGuard],
  //   data: {
  //     preload: true,
  //     breadcrumb: 'Caregiver Dashboard',
  //     title: 'Caregiver Dashboard',
  //     // loadChildren: () => import('./CareproviderDashboard/caregiver-admin.module').then((mode) => mode.CareproviderDashboardModule),
  //     permissionAllowed: UserPermission.HAS_CAREGIVER_DASHBOARD,
  //   },
  //   children: [
  //     {
  //       path: 'patientReadings',
  //       component: CareproviderPatientListComponent,
  //     },
  //     {
  //       path: 'totalPatients',
  //       component: TotalPatientsComponent,
  //     },
  //     {
  //       path: 'patientProfile',
  //       component: PatientDeatilsComponent,
  //     },
  //     {
  //       path: 'support-ticket',
  //       component: UserSupportComponent,
  //     },
  //   ],
  // },

  {
    path: 'careproviderDashboard',
    component: DocDashboardComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    data: {
      preload: true,
      breadcrumb: 'doctor-dashboard',
      title: 'doctor-dashboard',
      // loadChildren: () => import('./CareproviderDashboard/caregiver-admin.module').then((mode) => mode.CareproviderDashboardModule),
      // permissionAllowed: UserPermission.HAS_DOCTOR_DASHBOARD,
    },
    children: [
      {
        path: 'careprovider-patient-list',
        component: CareproviderPatientListComponent,
      },
      {
        path: 'totalPatients',
        component: TotalPatientsComponent,
      },
      {
        path: 'device',
        component: PatientDeviceListComponent,
        data: {
          preload: true,
          breadcrumb: 'Patient-device',
          actionName: 'Assign Device',
          title: 'Devices',
          // showActionBtn: true,
          showReturnBtn: true,
          permissionAllowed: UserPermission.HAS_ENROLLMENT_PAGE,
        },
      },
      {
        path: 'guardians',
        component: GuardiansComponent,

        data: {
          title: 'Guardians',
          // // showActionBtn: true,
          // showReturnBtn: true,
          // permissionAllowed: UserPermission.HAS_ENROLLMENT_PAGE,
        },
      },
      {
        path: 'patientProfile',
        component: DoctorPatientsDetailsComponent,
      },
      {
        path: 'support-ticket',
        component: UserSupportComponent,
      },
    ],
  },

  {
    path: '**',
    canActivate: [AuthGuard],
    component: PageNotFoundComponent,
    // data: {
    //   preload: false,
    //   breadcrumb: 'Page Not Found',
    //   title: 'Page Not Found',
    // },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
