import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import {
  Patient,
  PatientRegistrationURL,
  PatientResponse,
} from '../entities/patient';
import { PatientDataSource } from '../service/patient-data-source';
import { PatientManagementService } from '../service/patient-management.service';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { merge } from 'rxjs';
import { ROUTEINFO } from 'src/app/shared/entities/route.info';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models/user.model';
import { UserPermission } from 'src/app/shared/entities/user-permission.enum';
import { UserRoles } from 'src/app/shared/entities/user-roles.enum';
import { ToolbarService } from 'src/app/core/services/toolbar.service';
import { HospitalManagementService } from 'src/app/hospital-management/service/hospital-management.service';
import { BranchService } from 'src/app/branches/branch/branch.service';
import { threadId } from 'worker_threads';
import { ThisReceiver } from '@angular/compiler';
import { PatientConsentFormDialogComponent } from './patient-consent-form-dialog/patient-consent-form-dialog.component';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { TitleCasePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MatTable } from '@angular/material/table';
import { MyCareTeamComponent } from 'src/app/CommonComponents/doctor-patients-details/my-care-team/my-care-team.component';


@Component({
  selector: 'app-patient-mgmt',
  templateUrl: './patient-mgmt.component.html',
  styleUrls: ['./patient-mgmt.component.scss'],
})
export class PatientMgmtComponent implements OnInit, AfterViewInit, OnDestroy {
  public pageSize = 10;
  public noOfElements = 200;
  public filterRow: FormGroup;
  public displayedColumns: string[];
  isEnableClinic: boolean;
  isEnablePrimaryPhysician: boolean;
  public expandedElement: Patient | null;
  public dataSource: PatientDataSource;
  public patient: PatientResponse;
  public routeDetails: ROUTEINFO;
  leavingComponent: boolean = false;
  messageSuccess: boolean;
  docId: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  public patientForm: FormGroup;
  private allowedPermission: UserPermission = UserPermission.CAN_ADD_PATIENT;
  private changeTitle: UserPermission =
    UserPermission.CAN_CHANGE_ENROLLMENT_TITLE;
  public addDevicePermission: UserPermission =
    UserPermission.CAN_ADD_DEVICE_TO_PATIENT;
  hospitalId: string;
  branchId: string;
  providerId: string;
  providerName: string;
  branchName: string;
  hospital = [];
  branch = [];
  provider = [];
  public showReturnBtn: boolean;
  public selectedRole: UserRoles;
  public userRoles = UserRoles;
  filterData = '';
  rpmtimelist = [0, 20, 40, 60];
  clinicList = [];
  searchquery = new FormControl();
  isEnableGlobalSearch: boolean;
  userRole: string;
  showValidTextMessage = false;
  searchValue: any;
  changeStatus: string;
  searchStatus: any;
  itemsPerPageClicked: boolean = false;
  adminAccess: string;

  constructor(
    public patientService: PatientManagementService,
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: SnackbarService,
    protected dialog: MatDialog,
    private route: ActivatedRoute,
    private toolbarService: ToolbarService,
    private hospitalservice: HospitalManagementService,
    private branchservice: BranchService,
    private filterService: FilterSharedService,
    private titlecasePipe: TitleCasePipe,
    private renderer: Renderer2
  ) {
    this.leavingComponent = false;
    localStorage.removeItem('storedData');
    this.routeDetails = this.route.snapshot.data;
    const user = this.authService.authData;
    this.userRole = user.userDetails?.userRole;

    this.authService.user.subscribe((user: User) => {
      if (user?.userDetails?.permissions) {
        this.routeDetails.showActionBtn = user?.userDetails?.permissions.some(
          (permission) => permission === this.allowedPermission
        );
        if (
          user.userDetails?.permissions.some(
            (permission) => permission === this.changeTitle
          )
        ) {
          this.routeDetails.title = 'Patient Health Records';
        }
      }
    });

    window.onbeforeunload = function (e) {
      localStorage.removeItem('storedData');
      localStorage.removeItem('currentDilaog');
    };

    const currentDialog = localStorage.getItem('currentDilaog');
    if (currentDialog) {
      this.openAddPatientDialog();
    }
  }

  ngOnInit(): void {
    this.filterService.patientSearch({});
    this.leavingComponent = false;
    this.filterService.statusPatientCall('');
    this.displayedColumns = [
      'firstName',
      'gender',
      'dob',
      // 'age',
      'contactNumber',

      // 'branch',
      'personalEmail',
      'occupation',
      'primaryPhysician',
      // 'facility',
      // 'diagnosis',

      'userStatus',
      'Action',
    ];
    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.filterRow = this.fb.group({
      hospital: [null, Validators.nullValidator],
      branch: [null, Validators.nullValidator],
      provider: [null, Validators.nullValidator],
      status: [null, Validators.nullValidator],
      rpmtime: [null],
      searchquery: [null],
    });
    this.dataSource = new PatientDataSource(
      this.patientService,
      this.snackBar,
      this.authService
    );
    // if (this.userRole !== 'RPM_ADMIN') {
    //   this.dataSource.loadPatients(0, 10, 'createdAt', 'desc', '', '', '', '');
    // }
    this.route.queryParams.subscribe((params) => {
      this.hospitalId = params?.orgId;
      this.branchId = params?.branchId;
      this.providerId = params?.providerId;
      this.providerName = params?.providerName;
      this.toolbarService.setToolbarLabel(params);
      this.toolbarService.getToolbarLabelObs()?.subscribe((res) => {
        if (res && Object?.keys(res)?.length) {
          this.docId = res['providerId'];
          this.dataSource = new PatientDataSource(
            this.patientService,
            this.snackBar,
            this.authService
          );
          this.filterRow.get('provider').setValue(res['providerId']);
          // this.dataSource.loadPatients(
          //   0,
          //   10,
          //   'createdAt',
          //   'desc',
          //   '',
          //   res['providerId'],
          //   '',
          //   ''
          // );
          // this.onPatientFilter()
        }
        // else {

        //   this.dataSource = new PatientDataSource(this.patientService, this.snackBar);
        //   this.dataSource.loadPatients(0, 10, 'createdAt', 'desc', '', '', '');
        // }
      });
    });

    this.filterService.patientsSearch.subscribe((res) => {
      //  this.paginator.pageIndex = 0;
      this.searchValue = res;
      if (this.paginator) this.paginator.pageIndex = 0;
      this.isEnableGlobalSearchFunc();
    });

    this.filterService.statusPatient.subscribe((res) => {
      if (res.status !== 'ALL') {
        this.searchStatus = res;
        if (this.paginator) this.paginator.pageIndex = 0;
        if (Object.keys(res).length) {
          this.isEnableGlobalSearchFunc();
        } else {
          this.isEnableGlobalSearchFunc();
        }
      } else {
        this.paginator.pageIndex = 0;
        this.searchStatus = '';
        this.isEnableGlobalSearchFunc();
      }
    });

    // Function to get registration url
    // this.patientService.getIhealthRegistrationURL().subscribe(
    //   (response: PatientRegistrationURL) => {
    //     localStorage.setItem(
    //       'ihealthRegistrationURL',
    //       response.registrationUrl
    //     );
    //     localStorage.setItem('ihealthLoginURL', response.loginUrl);
    //   },
    //   () => {
    //     this.snackBar.error('Failed !');
    //   }
    // );

    this.authService.user.subscribe((user: User) => {
      this.selectedRole = user?.userDetails?.userRole;
    });
    if (this.selectedRole === 'HOSPITAL_USER') {
      this.displayedColumns?.splice(7, 0, 'facility');
    }
    this.adminAccess = localStorage.getItem('adminAccess');

    // if(this.adminAccess == 'false'){
    //   console.log(this.adminAccess);

    //   this.displayedColumns.pop();
    // }

    // this.hospitalservice.getPracticeList().subscribe(
    //   (res: any) => {
    //     this.hospital = res.hospitalList.filter(
    //       (element) => element.name != null
    //     );
    //   },
    //   (err) => {
    //     // this.snackBar.error(err.message);
    //   }
    // );
    // if (this.docId) {
    //   this.branchservice
    //     .getBranchListBydocId(this.docId)
    //     .subscribe((data: any) => {
    //       this.clinicList = data.branchList.filter(
    //         (element) => element.name != null
    //       );
    //       this.clinicList.sort((a, b) => (a.name > b.name ? 1 : -1));
    //     });
    // } else {
    //   this.branchservice.getClinicDropdownList().subscribe((data: any) => {
    //     this.clinicList = data?.branchList?.filter(
    //       (element) => element.name != null
    //     );
    //     this.clinicList?.sort((a, b) => (a.name > b.name ? 1 : -1));
    //   });
    // }
    // this.filterRow.get('provider').valueChanges.subscribe(provid => {
    //   this.providerName = provid.name;
    // });
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }

  // ngOnDestroy(): void {
  //   // this.toolbarService.setToolbarLabel(null);
  // }

  scrollToTop() {
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }

  ngAfterViewInit(): void {
    this.leavingComponent = false;
    setTimeout(() => {
      this.dataSource.totalElemObservable.subscribe((data) => {
        if (data > 0) {
          this.messageSuccess = true;
        } else if (data === 0) {
          this.messageSuccess = false;
        }
      });
    }, 1000);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.scrollToTop();
          this.loadPatientsPage();
        })
      )
      .subscribe();
  }

  getFullName(value) {
    return (
      this.titlecasePipe.transform(value.patientFirstName) +
      ' ' +
      this.titlecasePipe.transform(
        value.patientmiddleName ? value.patientmiddleName : ''
      ) +
      ' ' +
      this.titlecasePipe.transform(value.patientLastName)
    );
  }
  public openBulkDialog(): void {
    // const addDialogRef = this.dialog.open(PatintBulkUploadMgmtComponent, {
    //   disableClose: true,
    //   maxWidth: '300vw',
    //   maxHeight: '150vh',
    //   width: '65%',
    // });
    // addDialogRef.afterClosed().subscribe(() => {
    //   this.updateTable();
    // });
  }
  statusChange(email, val) {
    this.patientService.changeStatus(email, val).subscribe(
      (res) => {
        this.snackBar.success('Status updated successfully');
        this.loadPatientsPage();
      },
      (err) => {
        // this.snackBar.error(err.error?.messsage);
      }
    );
  }
  public openAddPatientDialog(): void {
    localStorage.setItem('currentDilaog', 'patient');
    const addDialogRef = this.dialog.open(AddPatientComponent, {
      disableClose: true,
      maxWidth: '100vw',
      // maxHeight: '120vh',
      height: '61vh',
      width: '65.8%',
    });

    addDialogRef.afterClosed().subscribe((e) => {
      if (e) {
        this.filterService.statusPatient.next({ status: 'ALL' });
        this.updateTable('', this.docId);
      }
      // this.toolbarService.getToolbarLabelObs().subscribe(res => {
      //   if (Object.keys(res).length) {
      // }
      // });
    });
  }

  protected updateTable(branchId, doctorId): void {
    this.searchquery.value !== '' ? this.searchquery.value : null;
    if (this.docId) {
      this.dataSource = new PatientDataSource(
        this.patientService,
        this.snackBar,
        this.authService
      );
      // this.dataSource.loadPatients(
      //   this.paginator.pageIndex,
      //   this.paginator.pageSize,
      //   this.sort.active,
      //   this.sort.direction,
      //   branchId !== '' ? branchId : null,
      //   this.docId !== '' ? this.docId : null,
      //   this.searchquery.value !== '' ? this.searchquery.value : null,
      //   this.searchStatus !== '' ? this.searchStatus : null
      // );
      this.onPatientFilter();
    } else {
      this.dataSource = new PatientDataSource(
        this.patientService,
        this.snackBar,
        this.authService
      );
      // this.dataSource.loadPatients(
      //   this.paginator?.pageIndex,
      //   this.paginator?.pageSize,
      //   this.sort?.active,
      //   this.sort?.direction,
      //   branchId !== '' ? branchId : null,
      //   doctorId !== '' ? doctorId?.id : null,
      //   this.searchValue !== '' ? this.searchValue : null,
      //   this.searchStatus !== '' ? this.searchStatus : null
      // );
      this.onPatientFilter();
    }
    setTimeout(() => {
      this.dataSource.totalElemObservable.subscribe((data) => {
        if (data > 0) {
          this.messageSuccess = true;
        } else if (data === 0) {
          this.messageSuccess = false;
        }
      });
    }, 1000);
  }

  public openEditPatientDialog(patient) {
    const editDialogRef = this.dialog.open(AddPatientComponent, {
      disableClose: true,
      maxWidth: '100vw',
      height: '61vh',
      width: '65.8%',
      // height: '77%',
      data: {
        patient,
        mode: 'edit',
      },
    });

    editDialogRef.afterClosed().subscribe((e) => {
      if (e) {
        this.filterService.statusPatient.next({ status: 'ALL' });
        this.filterRow.reset();
        this.searchquery.setValue(null);
        this.isEnableGlobalSearch = false;
        this.isEnableClinic = false;
        this.isEnablePrimaryPhysician = false;
        // this.toolbarService.getToolbarLabelObs().subscribe(res => {
        //   if (Object.keys(res).length) {
        this.updateTable('', this.docId);
        //   }
        // });
      }
    });
  }

  goToPatientData(PatientId: string): void {
    this.router.navigate(['/patient-data']);
  }

  public loadPatientsPage(): void {
    if (this.leavingComponent) {
      return;
    }
    // this.toolbarService.getToolbarLabelObs().subscribe(res => {
    if (this.docId) {
      this.updateTable('', this.docId);
    } else {
      this.updateTable(
        this.filterRow.get('branch').value
          ? this.filterRow.get('branch').value
          : '',
        this.filterRow.get('provider').value
          ? this.filterRow.get('provider').value
          : ''
      );
    }
    // });
  }
  noData() {
    return 'No Records Found!';
  }
  goToLinkUser(PatientId: string): void {
    this.snackBar.openSnackBar('Redirecting to iHealth portal.', 'wait', 3000);
    setTimeout(() => {
      window.open(localStorage.getItem('ihealthLoginURL'));
    }, 3001);
  }
  goToPatientDevice(patientdetail: any): void {
    localStorage.removeItem('currentDilaog');
    const filter = 'id:' + patientdetail.firstName;
    const patient_name = patientdetail?.patientmiddleName
      ? patientdetail?.patientFirstName?.charAt(0).toUpperCase() +
        patientdetail?.patientFirstName?.substr(1).toLowerCase() +
        ' ' +
        patientdetail?.patientmiddleName?.charAt(0).toUpperCase() +
        patientdetail?.patientmiddleName?.substr(1).toLowerCase() +
        ' ' +
        patientdetail?.patientLastName?.charAt(0).toUpperCase() +
        patientdetail?.patientLastName?.substr(1).toLowerCase()
      : patientdetail?.patientFirstName?.charAt(0).toUpperCase() +
        patientdetail?.patientFirstName?.substr(1).toLowerCase() +
        ' ' +
        patientdetail?.patientLastName?.charAt(0).toUpperCase() +
        patientdetail?.patientLastName?.substr(1).toLowerCase();

    localStorage.setItem('patient_id', patientdetail.id);
    localStorage.setItem('org_id', patientdetail.hospitalId);
    this.router.navigate(['/home/patients/device'], {
      queryParams: { name: patient_name },
      skipLocationChange: false,
    });

    // history.pushState(filter, '', '/home/patient/device');
  }

  getTextValue(val): void {
    return val ? val : '';
  }

  onhospitalSelection(event: any): any {
    this.branch = [];
    this.branchservice.getOrgClinicList(event).subscribe((data: any) => {
      this.branch = data.content;
      this.branch.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }
  getGender(ele): any {
    if (ele.gender.includes('_')) {
      let splittedGender = ele.gender.split('_');
      if (splittedGender.length === 2) {
        return (
          this.titlecasePipe.transform(splittedGender[0]) +
          ' ' +
          splittedGender[1].toLowerCase()
        );
      } else if (splittedGender.length === 3) {
        return (
          this.titlecasePipe.transform(splittedGender[0]) +
          ' ' +
          splittedGender[1].toLowerCase() +
          ' ' +
          splittedGender[2].toLowerCase()
        );
      } else if (splittedGender.length === 4) {
        return (
          this.titlecasePipe.transform(splittedGender[0]) +
          ' ' +
          splittedGender[1].toLowerCase() +
          ' ' +
          splittedGender[2].toLowerCase() +
          ' ' +
          splittedGender[3].toLowerCase()
        );
      }
    } else {
      return this.titlecasePipe.transform(ele.gender);
    }
  }
  // onBranchSelection(event): any {
  //   this.provider = [];
  //   this.branchservice.getBranchDoctor(event).subscribe((data: any) => {
  //     this.provider = data;
  //   });
  // }

  viewAllProviders(): void {
    this.router.navigate(['/home/users']);
  }
  getPhysicianName(element) {
    return (
      (element?.firstName
        ? this.titlecasePipe.transform(element.firstName)
        : '') +
      ' ' +
      (element?.middleName
        ? this.titlecasePipe.transform(element.middleName)
        : '') +
      ' ' +
      (element?.lastName ? this.titlecasePipe.transform(element.lastName) : '')
    );
  }
  getName(e, ele) {
    const firstName =
      e?.firstname !== ele?.firstName
        ? this.titlecasePipe.transform(e?.firstName)
        : '';
    const middleName =
      e?.middleName !== ele?.middleName
        ? this.titlecasePipe.transform(e?.middleName)
        : '';
    const lastName =
      e?.lastName !== ele?.lastName
        ? this.titlecasePipe.transform(e?.lastName)
        : '';

    return firstName + ' ' + middleName + ' ' + lastName;
  }
  // getFacilityName(ele){
  //   return ele.name ? this.titlecasePipe.transform(ele.name):'';
  // }
  getFacilityName(ele) {
    if (ele && ele.name) {
      const facilityName = ele.name.trim();
      return facilityName ? this.titlecasePipe.transform(facilityName) : '';
    } else {
      // Handle the case where ele or ele.name is null or not available
      return '-';
    }
  }

  getFacilityNameSub(e, ele) {
    const firstName =
      e?.name !== ele?.name ? this.titlecasePipe.transform(e?.name) : '';
    return firstName;
  }
  onPatientFilter(): void {
    const regExp = /[a-zA-Z]/g;
    const testString = this.searchquery.value;
    const branchId = this.filterRow.get('branch').value;
    const doctorId = this.filterRow.get('provider').value;

    // if (
    //   !this.searchquery.value &&
    //   !this.filterRow.get('branch').value &&
    //   !this.filterRow.get('provider').value &&
    //   !this.isEnableGlobalSearch &&
    //   !this.isEnableClinic &&
    //   !this.isEnablePrimaryPhysician &&
    //   !doctorId
    // ) {
    //   return;
    // }
    // if (this.searchValue.value && !regExp.test(testString)) {
    //   this.showValidTextMessage = true;
    //   return;
    // }
    // if (
    //   (this.userRole === 'BRANCH_USER' || this.userRole === 'HOSPITAL_USER') &&
    //   this.isEnableGlobalSearch &&
    //   this.docId &&
    //   !this.searchValue.value
    // ) {
    //   this.updateTable(branchId, doctorId);
    //   this.isEnableGlobalSearch = false;
    // }
    // if (
    //   this.docId &&
    //   !this.searchValue.value &&
    //   !this.filterRow.get('branch').value
    // ) {
    //   return;
    // }

    // if (!this.searchquery.value) {
    //   this.isEnableGlobalSearch = false;
    // }
    // if (!branchId) {
    //   this.isEnableClinic = false;
    // }
    // if (!doctorId) {
    //   this.isEnablePrimaryPhysician = false;
    // }
    // if (this.docId) {
    //   this.updateTable(branchId, doctorId);
    // } else {
    let params;
    if (this.searchValue?.searchQuery && this.searchStatus?.status) {
      params = {
        searchQuery: this.searchValue?.searchQuery
          ? this.searchValue.searchQuery
          : '',
        status: this.searchStatus?.status ? this.searchStatus.status : '',
      };
    }
    if (!this.searchValue?.searchQuery && this.searchStatus?.status) {
      params = {
        status: this.searchStatus.status ? this.searchStatus.status : '',
      };
    }
    if (this.searchValue?.searchQuery && !this.searchStatus?.status) {
      params = {
        searchQuery: this.searchValue?.searchQuery
          ? this.searchValue.searchQuery
          : '',
      };
    }
    const searchData = new HttpParams({ fromObject: params });

    this.dataSource.loadPatients(
      this.paginator?.pageIndex ? this.paginator?.pageIndex : 0,
      this.paginator?.pageSize ? this.paginator?.pageSize : 10,
      // this.sort.active,
      // this.sort.direction,
      branchId !== '' ? branchId : null,
      doctorId?.id !== '' ? doctorId?.id : null,
      searchData
    );
    // }
  }
  unselectGlobalSearch(): void {
    this.showValidTextMessage = false;
    this.searchquery.setValue(null);
    this.onPatientFilter();
    this.dataSource.totalElemObservable.subscribe((data) => {
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0 || data == undefined) {
        this.messageSuccess = false;
      }
    });
  }
  isEnableGlobalSearchFunc(): any {
    if (this.leavingComponent) {
      return;
    }
    //  debugger
    if (this.searchValue && this.searchValue?.length > 2) {
      this.onPatientFilter();
      this.isEnableGlobalSearch = true;
    } else if (this.searchStatus) {
      this.onPatientFilter();
      this.isEnableGlobalSearch = true;
    } else if (!this.searchquery.value?.length) {
      this.messageSuccess = true;
      this.loadPatientsPage();
      this.isEnableGlobalSearch = false;
      this.showValidTextMessage = false;
    }
  }
  // openClaimsDialog(addid: any) {
  //   const raiseDoctorModalConfig = new MatDialogConfig();
  //   // The user can't close the dialog by clicking outside its body
  //   raiseDoctorModalConfig.disableClose = true;
  //   (raiseDoctorModalConfig.maxWidth = '100vw'),
  //     // 	(raiseDoctorModalConfig.maxHeight = "100vh"),
  //     // raiseDoctorModalConfig.height = "60vh",
  //     (raiseDoctorModalConfig.width = '750px'),
  //     (raiseDoctorModalConfig.data = { id: addid }),
  //     this.dialog
  //       .open(ClaimDialogComponent, raiseDoctorModalConfig)
  //       .afterClosed()
  //       .subscribe(() => {
  //         // this.getClaimsList();
  //       });
  // }
  unselectClinic(): void {
    this.filterRow.get('branch').reset();
    this.onPatientFilter();
    // this.isEnableClinic = false;
  }
  openConsentForm(element) {
    this.router.navigate(['/home/patients/consent-form', element.id]);
  }
  uploadConsentForm(element) {
    const editDialogRef = this.dialog.open(PatientConsentFormDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '40%',
      data: element.id,
    });

    editDialogRef.afterClosed().subscribe((e) => {
      if (e) {
        // this.dataSource.loadPatients(
        //   0,
        //   10,
        //   'createdAt',
        //   'desc',
        //   '',
        //   '',
        //   '',
        //   ''
        // );
        this.onPatientFilter();
      }
    });
  }
  patientStatusChange(ele) {
    if (ele.userStatus == 'ACTIVE') {
      this.changeStatus = 'INACTIVE';
    } else {
      this.changeStatus = 'ACTIVE';
    }

    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '185px',
      data: {
        title: 'Status Change',
        content: `You are updating patient "${this.titlecasePipe.transform(
          ele.patientFirstName
        )} ${this.titlecasePipe.transform(ele.patientLastName)}" as "${
          this.changeStatus == 'ACTIVE' ? 'Active' : 'Inactive'
        }"`,
      },
    };
    // this.dialog.closeAll();
    this.dialog
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.branchservice
            .statusChange(this.changeStatus, ele.id)
            .subscribe((data: any) => {
              this.provider = data;
              // this.dataSource.loadPatients(
              //   0,
              //   10,
              //   'createdAt',
              //   'desc',
              //   '',
              //   '',
              //   '',
              //   ''
              // );
              this.snackBar.success('Status updated successfully');
              this.onPatientFilter();
            });
        } else {
        }
      });
  }
  viewCareTeam(ele) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '185px',
      data: {
        title:
          ele.careProviders[0].firstName + ' ' + ele.careProviders[0].lastName,
        content: ele.careTeam,
        careproviderRole: ele.careProviders[0].role,
      },
    };
    // this.dialog.closeAll();
    this.dialog
      .open(MyCareTeamComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {});
  }

  downloadPatientConsentForm(element): any {
    // this.router.navigate(['/home/patient/consent-form', element.id]);
    this.patientService.downloadPatientConsentForm(element.consentFormUrl);
  }
  isEnableClinicFunc(): any {
    this.isEnableClinic = true;
  }
  isEnablePrimaryPhysicianFunc(): any {
    this.isEnablePrimaryPhysician = true;
  }
  unselectPrimaryPhysicain(): void {
    this.filterRow.get('provider').reset();
    this.onPatientFilter();
    // this.isEnablePrimaryPhysician = false;
  }
}
