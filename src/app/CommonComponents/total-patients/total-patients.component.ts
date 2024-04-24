import { tap } from 'rxjs/operators';
import { TotalPatientsDataSource } from './total-patients-datasource';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { merge, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import _moment, { Moment, default as _rollupMoment } from 'moment';
import { FormControl } from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import {
  PatientExcelInterface,
  ReportsService,
} from 'src/app/reports/service/reports.service';
import { FileService } from 'src/app/core/services/file.service';
import { MatSort } from '@angular/material/sort';
import { ReportsTemplateComponent } from '../reports-template/reports-template.component';
import { AddPatientComponent } from 'src/app/patient-management/patient-mgmt/add-patient/add-patient.component';
import { TitleCasePipe } from '@angular/common';
import { AddDiagnosticComponent } from '../doctor-patients-details/diagnostic/add-diagnostic/add-diagnostic.component';
import { MyCareTeamComponent } from '../doctor-patients-details/my-care-team/my-care-team.component';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-total-patients',
  templateUrl: './total-patients.component.html',
  styleUrls: ['./total-patients.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TotalPatientsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public dataSource: TotalPatientsDataSource;
  showPatientData = false;
  messageSuccess: boolean;
  public patientData: any = [];
  public isDataLoaded: boolean;
  counter = 0;
  initialData: any;
  count: any;
  roleid: string;
  userRole: string;
  tableContent: any = [];
  patientDetails: any = [];
  patientId: any = [];
  zone: string;
  size = 5;
  pageIndex = 0;
  totalp = 1;
  totalPatientsDataSource: any;
  totalPatientsList: any = [];
  searchData: string;
  showSearchBadge = false;
  reportsDate: string;
  max: Date = new Date();
  reportsDateSubscription: Subscription;
  displayedColumns: string[] = [
    'patient',
    'contactNo',
    'address',
    'primaryPhysician',
    'status',
    'action',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  details: any;
  data: any;
  constructor(
    private router: Router,
    private caregiverSharedService: CaregiverSharedService,
    private service: CaregiverDashboardService,
    private snackbarservice: SnackbarService,
    private auth: AuthService,
    private sanitization: DomSanitizer,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public reportService: ReportsService,
    private fileService: FileService,
    private titlecasePipe: TitleCasePipe,
    private filterService: FilterSharedService
  ) {
    this.reportsDate = '';
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;

    this.dataSource = new TotalPatientsDataSource(
      this.service,
      this.snackbarservice
    );
  }

  date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment): void {
    const ctrlValue = this.date.value;
    //
    ctrlValue.year(normalizedYear.year());
    //
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ): void {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.reportService.setReportDate(ctrlValue.format('YYYY-MM-DD'));
    datepicker.close();
  }

  ngOnInit(): void {
    this.cancelSearch();
    this.caregiverSharedService.triggeredHeaderTitle.next('Total Patients');
    this.tabCounts();
    const searchValue = localStorage.getItem('totPatSearchValue');
    if (searchValue) {
      this.searchData = searchValue;
      this.showSearchBadge = true;
      this.dataSource.loadTotalPatientsBySearchQuery(this.searchData, 0);
    } else {
      this.dataSource.loadTotalPatients(0);
    }
    this.reportsDateSubscription = this.reportService.reportsDate$.subscribe(
      (res) => {
        this.reportsDate = res;
        localStorage.setItem('reports_date', this.reportsDate);
      }
    );
    this.dataSource.totalElemObservable.subscribe((data) => {
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0) {
        this.messageSuccess = false;
      }
    });
    if (this.userRole === 'CAREPROVIDER') {
      this.getDoctorDetails();
    }
  }
  ngAfterViewInit() {
    if (this.sort !== undefined) {
      this.sort?.sortChange?.subscribe(() => {
        this.paginator.pageIndex = 0;
      });
      merge(this.sort?.sortChange, this.paginator.page)
        .pipe(
          tap(() => {
            this.loadTotalPatients();
          })
        )
        .subscribe();
    }
  }
  tabCounts() {
    this.service.getTabCounts().subscribe((data) => {
      localStorage.setItem('tabCount', JSON.stringify(data));
      this.filterService.tabCountData.next({
        data: JSON.parse(localStorage.getItem('tabCount')),
      });
    });
  }
  getInputSrchData(evt: any) {
    // localStorage.setItem('totalPatSearch', evt);
  }
  getFullName(element) {
    return (
      this.titlecasePipe.transform(element.patientFirstName) +
      ' ' +
      (element.patientmiddleName
        ? this.titlecasePipe.transform(element.patientmiddleName)
        : '') +
      ' ' +
      this.titlecasePipe.transform(element.patientLastName)
    );
  }
  loadTotalPatients(): void {
    this.counter = this.paginator.pageIndex;
    localStorage.setItem(
      'page-index',
      JSON.stringify(this.paginator.pageIndex)
    );
    this.dataSource.loadTotalPatients(
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
  getDoctorDetails(): void {
    this.data = JSON.parse(localStorage.getItem('careproviderDetails'));
    this.details = this.data.facilities;
    localStorage.setItem('facilitiesdata', JSON.stringify(this.details));
    // this.service.getUserDetails().subscribe(
    //   (data) => {
    //     this.details = data.facilities;
    //     localStorage.setItem('facilitiesdata', JSON.stringify(this.details));
    //   },
    //   (err) => {
    //     if (err.status === 401) {
    //       this.router.navigate(['/login']);
    //     } else {
    //       // this.snackbarService.error(err.error.message);
    //     }
    //   }
    // );
  }
  ngOnDestroy(): void {
    this.reportsDateSubscription.unsubscribe();
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
  getcareTeam(id) {
    this.service.getCareTeam(id).subscribe(
      (res) => {},
      (error) => {}
    );
  }

  viewCareTeam(ele) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '210px',
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

  openPatientProfile(id, name, type, idx) {
    if (this.userRole === 'CAREPROVIDER') {
      if (
        this.route.snapshot['_routerState'].url.includes('/doctorDashboard')
      ) {
        this.router.navigate(['/careproviderDashboard/patientProfile']);
      } else {
        this.router.navigate(['/careproviderDashboard/patientProfile']);
      }
      if (this.counter === 0) {
        localStorage.setItem('patientIndex', idx);
        localStorage.setItem('patientIndexForward', idx);
      } else {
        localStorage.setItem('patientIndex', idx);
        localStorage.setItem('patientIndexForward', idx);

        // localStorage.removeItem('patientIndex');
      }
      localStorage.setItem('patientId', id);
      localStorage.setItem('patientName', name);
      localStorage.setItem('zoneType', type);
      this.caregiverSharedService.changeHeaderTitle('patientProfile');
      localStorage.setItem('moduleName', 'totalPatients');
    }
  }
  backToDashboard() {
    this.router.navigate(['careproviderDashboard/careprovider-patient-list']);
    this.caregiverSharedService.triggeredHeaderTitle.next('Dashboard');
  }

  getDate(date) {
    return this.caregiverSharedService.formatDate(new Date(date));
  }
  getImage(image): SafeUrl {
    if (image) {
      return this.sanitization.bypassSecurityTrustUrl(image);
    } else {
      return '';
    }
  }
  getPatientByPid(id) {
    this.service.getPatientById(id).subscribe(() => {});
  }

  getBySearchParams() {
    // const regExp = /[a-zA-Z]/g;
    const testString = this.searchData;

    if (testString?.length > 2) {
      this.showSearchBadge = true;
      this.dataSource.loadTotalPatientsBySearchQuery(this.searchData, 0);
      localStorage.setItem('totPatSearchValue', this.searchData);
    } else {
      if (!testString.length) {
        this.dataSource.loadTotalPatients(0);
        localStorage.removeItem('totPatSearchValue');
        this.showSearchBadge = false;
      }
    }
  }
  goToPatientGuardin(ele) {
    // console.log(ele);

    this.router.navigate(['/careproviderDashboard/guardians'], {
      queryParams: {
        patientId: ele.id,
        name: ele.patientFirstName,
        middleName: ele.patientmiddleName,
        lastName: ele.patientLastName,
      },
      skipLocationChange: false,
    });
  }
  goToPatientDevice(patientdetail: any): void {
    // localStorage.removeItem('currentDilaog');
    // const filter = 'id:' + patientdetail.firstName;
    // const patient_name = patientdetail?.patientmiddleName
    //   ? patientdetail?.patientFirstName?.charAt(0).toUpperCase() +
    //     patientdetail?.patientFirstName?.substr(1).toLowerCase() +
    //     ' ' +
    //     patientdetail?.patientmiddleName?.charAt(0).toUpperCase() +
    //     patientdetail?.patientmiddleName?.substr(1).toLowerCase() +
    //     ' ' +
    //     patientdetail?.patientLastName?.charAt(0).toUpperCase() +
    //     patientdetail?.patientLastName?.substr(1).toLowerCase()
    //   : patientdetail?.patientFirstName?.charAt(0).toUpperCase() +
    //     patientdetail?.patientFirstName?.substr(1).toLowerCase() +
    //     ' ' +
    //     patientdetail?.patientLastName?.charAt(0).toUpperCase() +
    //     patientdetail?.patientLastName?.substr(1).toLowerCase();

    localStorage.setItem('patient_id', patientdetail.id);
    // localStorage.setItem('org_id', patientdetail.hospitalId);
    this.router.navigate(['/careproviderDashboard/device'], {
      queryParams: {
        name: patientdetail?.patientFirstName + patientdetail?.patientLastName,
      },
      skipLocationChange: false,
    });

    // history.pushState(filter, '', '/home/patient/device');
  }

  public openEditPatientDialog(patient) {
    const editDialogRef = this.dialog.open(AddPatientComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '140vh',
      width: '65.9%',
      // height: '77%',
      data: {
        patient,
        mode: 'edit',
      },
    });
    editDialogRef.afterClosed().subscribe(() => {
      this.dataSource.loadTotalPatients(0);
    });
  }
  public openEditPatientDiagnostics(patient) {
    const editDialogRef = this.dialog.open(AddPatientComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '140vh',
      width: '65.9%',
      // height: '77%',
      data: {
        patient,
        diagnostics: 'update',
      },
    });
    editDialogRef.afterClosed().subscribe(() => {
      this.dataSource.loadTotalPatients(0);
    });
  }
  addDiagnostic(ele): void {
    localStorage.setItem('patientId', ele.id);
    const raiseDoctorModalConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    raiseDoctorModalConfig.disableClose = true;
    (raiseDoctorModalConfig.maxWidth = '100vw'),
      (raiseDoctorModalConfig.maxHeight = '100vh'),
      // raiseDoctorModalConfig.height = "60vh",
      (raiseDoctorModalConfig.width = '65%'),
      (raiseDoctorModalConfig.data = { mode: 'ADD' }),
      this.dialog
        .open(AddDiagnosticComponent, raiseDoctorModalConfig)
        .afterClosed()
        .subscribe((e) => {
          if (e) {
            this.dataSource.loadTotalPatients(0);
          }
        });
  }

  public openAddPatientDialog(): void {
    localStorage.setItem('currentDilaog', 'patient');
    const addDialogRef = this.dialog.open(AddPatientComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '140vh',
      width: '65.9%',
    });

    addDialogRef.afterClosed().subscribe(() => {
      this.dataSource.loadTotalPatients(0);
    });
  }
  cancelSearch() {
    localStorage.removeItem('totPatSearchValue');
    this.showSearchBadge = false;
    this.searchData = '';
    this.dataSource.loadTotalPatients(0);
  }
  // opentotalPatients() {
  //   if (this.route.routeConfig.path == 'caregiverDashboard')
  //     this.router.navigate(['/caregiverDashboard/totalPatients', 'caregiver']);
  //   else
  //     this.router.navigate(['/doctorDashboard/totalPatients', 'doctor']);
  //   this.caregiverSharedService.changeMessage([]);
  // }

  downloadOverallReports(): void {
    this.reportService
      .getOverallPatientReports(this.reportsDate)
      .subscribe((res: PatientExcelInterface) => {
        this.fileService.saveBlob(res);
      });
  }

  // downloadPatientReports(patientId: string): void {
  //   this.reportService.getPatientReports(patientId, this.reportsDate).subscribe((res: PatientExcelInterface) => {
  //     this.fileService.saveBlob(res);
  //   });
  // }
  downloadPatientReports(id): void {
    // const url = this.router.serializeUrl(
    //   // this.router.navigate(['/reports-template',id])
    // );

    window.open(`/reports-template/${id}`, '_blank');
  }

  openPdfDialog(patId) {
    const pdfModalConfig: MatDialogConfig = {
      width: '100vw',
      height: '100%',
      // position: { right: `15vw`, top: '8vh' },
      disableClose: true,
      data: patId,
    };
    const videoCallDialog = this.dialog.open(
      ReportsTemplateComponent,
      pdfModalConfig
    );
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
}
