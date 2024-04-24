import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { defaultProfileImage } from 'src/app/shared/base64/profile-image';
import { AuthService } from '../../core/services/auth.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { TicketService } from 'src/app/ticket/ticket.service';
import { PatientManagementService } from 'src/app/patient-management/service/patient-management.service';
import { User } from 'src/app/shared/models/user.model';

import { Router, ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { SidenavService } from 'src/app/core/services/sidenav.service';
import { UserProfile } from 'src/app/shared/entities/user-profile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/notification/service/notification.service';
import { UserRoles } from 'src/app/shared/entities/user-roles.enum';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DateTransformPipe } from 'src/app/shared/pipes/date-transform.pipe';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss'],
})
export class DoctorDashboardComponent {
  chartData = [];
  cardDataList: any;
  public date: any;
  public profileImgPath = defaultProfileImage;
  profileDataList: UserProfile;
  image: any;
  requestRecord: any;
  requestId: string;
  patientId: string;
  requestchat: any;
  userDetails: User;
  loggedinUser: string;
  requestedName: string;
  records: any;
  patientData: any;
  defaultRequestId: string;
  showTextBox = false;
  public profileImagePath: SafeResourceUrl;
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public addMessageForm: FormGroup;
  public barChartLabels: Label[] = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
  ];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Patients', stack: 'a' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Doctors', stack: 'a' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Clinic', stack: 'a' },
  ];

  chartType: ChartType = 'bar';

  hideTypeDropdown = false;
  claimList: any;
  allUnreadNotify: any;
  claimRaisedColumns: string[] = [
    'patient.firstName',
    'rpmTime',
    'claimStatus',
    'dateOfService',
    'actions',
  ];
  public selectedRole: UserRoles;
  public userRoles = UserRoles;
  private defaultProfileImg = defaultProfileImage;

  constructor(
    private auth: AuthService,
    private domSanitizerService: DomSanitizer,
    private ticketservice: TicketService,
    private patientservice: PatientManagementService,
    private router: Router,
    private authService: AuthService,
    private sideNavService: SidenavService,
    private fb: FormBuilder,
    private notificationservice: NotificationService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.authService.user.subscribe((user: User) => {
      this.selectedRole = user?.userDetails?.userRole;
    });

    this.chartData = [
      this.barChartLabels,
      this.barChartData,
      this.chartType,
      this.hideTypeDropdown,
    ];
    this.getCardData();
    setTimeout(() => {
      this.getDoctorDetails();
    }, 1000);
    this.userDetails = JSON.parse(localStorage.getItem('auth'));
    this.loggedinUser = this.userDetails?.userDetails?.username;
    // this.getClaimTableList();
    this.getRequestChatData();
    this.getUnreadNotify();
    this.addMessageForm = this.fb.group({
      commentText: ['', Validators.compose([Validators.required])],
    });
  }

  // ngOnInit(): void {;
  // };

  getCardData(): void {
    // this.dashboardservice.getDashboardCardData().subscribe(
    //   (data) => {
    //     this.cardDataList = data;
    //   },
    //   (error) => {
    //     // this.snackBarService.error('Failed!', 2000);
    //   }
    // );
  }
  getDoctorDetails(): void {
    // this.profileservice.getProfileData().subscribe(
    //   (res) => {
    //     this.profileDataList = res.userProfile;
    //     let urlencodeStr = '';
    //     if (res.userProfile !== undefined) {
    //       this.sideNavService.setUserDetails(res.userProfile);
    //       if (res.userProfile.profileImage && res.userProfile.profileImage.image) {
    //         urlencodeStr = `data: ${res.userProfile.profileImage.memeType};base64,${res.userProfile.profileImage.image}`;
    //       } else {
    //         urlencodeStr = this.defaultProfileImg;
    //       }
    //     }
    //     else {
    //       urlencodeStr = this.defaultProfileImg;
    //     }
    //     this.profileImagePath = this.domSanitizerService.bypassSecurityTrustResourceUrl(urlencodeStr);
    //     // this.profileImagePath = this.domSanitizerService.bypassSecurityTrustResourceUrl(
    //     //   `data: ${res.userProfile.profileImage.memeType};base64,${res.userProfile.profileImage.image}`
    //     // );
    //   },
    //   (error) => {
    //     this.profileImagePath = this.domSanitizerService.bypassSecurityTrustResourceUrl(this.defaultProfileImg);
    //   }
    // );
  }

  goToEnrollmentsPage(): void {
    this.router.navigate(['/patient']);
  }

  goToClaimsPage(): void {
    this.router.navigate(['/claim']);
  }

  onLogout(): void {
    this.authService.logout();
  }

  // getClaimTableList(): void {
  //   const startOfMonth: any = moment().clone().startOf('month').format('yyyy-MM-DD');
  //   const endOfMonth: any = moment().clone().endOf('month').format('yyyy-MM-DD');
  //   this.dataSource.loadPatientClaimsForDoctor('createdAt', 'desc', startOfMonth, endOfMonth);
  //   this.dataSource.patientClaimSubject.subscribe(
  //     data => {
  //       this.claimList = data;
  //     }
  //   );
  // }

  onClickProfile(): void {
    this.sideNavService.setProfileOpened(true);
    // this.sideNavService.setProfileImage(this.profileImagePath);
  }
  showTextWindow(event): void {
    this.requestId = event.request.id;
    this.showTextBox = true;
  }

  submitChat(): void {
    if (this.addMessageForm.valid) {
      const body = {
        message: this.addMessageForm.get('commentText').value,
        request: {
          id: this.requestId,
        },
      };
      this.ticketservice.addRequest(body).subscribe(
        (data) => {
          this.showTextBox = false;
          this.addMessageForm.reset();
        },
        (error) => {
          // this.snackBarService.error('Failed!', 2000);
        }
      );
    }
  }
  getRequestChatData(): void {
    // this.dashboardservice.getDashboardChatData().subscribe(
    //   (data) => {
    //     this.requestRecord = data.content;
    //   },
    //   (error) => {
    //     // this.snackBarService.error('Failed!', 2000);
    //   }
    // );
  }

  getUnreadNotify(): void {
    this.notificationservice.getAllUnreadNotify().subscribe(
      (data) => {
        this.allUnreadNotify = data.content;
      },
      (error) => {
        // this.snackBarService.error('Failed!', 2000);
      }
    );
  }

  // deleteClaim(claimDetails): void {
  //   let patientName = '';
  //   if (claimDetails && claimDetails.patient) {
  //     patientName = [claimDetails.patient.firstName, claimDetails.patient.middleName, claimDetails.patient.lastName].join(' ');
  //   }
  //   const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
  //     data: {
  //       title: 'Confirm the deletion of claim details',
  //       message: 'Are you sure you want to delete the claim details of the patient: ' + patientName,
  //       mode: 'delete'
  //     }
  //   });
  // eslint-disable-next-line , import/no-deprecated
  //   confirmDialog.afterClosed().subscribe(result => {
  //     if (result === true) {
  // eslint-disable-next-line import/no-deprecated
  //       this.claimService.deleteClaimByDoctor(claimDetails.id).subscribe(
  //         (data) => {
  //           this.getClaimTableList();
  //           this.snackBarService.success('Deleted successfully!', 2000);
  //         },
  //         (error) => {
  //           this.snackBarService.error('Failed!', 2000);
  //         }
  //       );
  //     }
  //   });
  // }
  goToNotification(): void {
    this.router.navigate(['/notification']);
  }

  gotohelpDesk(): void {
    this.router.navigate(['/request']);
  }

  readNotification(notificationData): void {
    this.notificationservice.getStatus(notificationData.id).subscribe(
      (data) => {
        if (data) {
          notificationData.seen = true;
        }
      },
      (error) => {
        // this.snackBarService.error('Failed', 2000);
      }
    );
  }
}
