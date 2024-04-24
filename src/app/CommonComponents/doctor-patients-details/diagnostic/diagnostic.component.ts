import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddDiagnosticComponent } from './add-diagnostic/add-diagnostic.component';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { FiltersStateService } from 'src/app/core/services/filters-state.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.component.html',
  styleUrls: ['./diagnostic.component.scss'],
})
export class DiagnosticComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'date',
    'baselineSystolic',
    'baseloneDiastolic',
    'height(CMs)',
    'weight(Kg)',
    'diagnosis',
    // 'patientUnderMadication',
    'hbA1C(Percent)',
    'cholesterol(mg/dL)',
    'triglyceride(mg/dL)',
    'HD(mg/dL)',
    'LDL(mg/dL)',
    'fasting Sugar(mg/dL)',
    'postprandial(mg/dL)',
    'random Sugar(mg/dL)',
    'actions',
  ];
  dataSource: any;
  patientId: string;
  chartToDate: Date = new Date();
  chartFromDate: Date = new Date();
  filterfromDate: string;
  filterToDate: string;
  userRole: string;
  careproviderId: string;
  leavingComponent: boolean = false;
  addPermission: string;
  vitlsHistoryList: any = [];
  loadRes: boolean = true;
  p = 1;
  size = 4;
  pageIndex = 0;
  vitlstotalElements: any;
  constructor(
    private caregiverSharedservice: CaregiverSharedService,
    private service: CaregiverDashboardService,
    private auth: AuthService,
    public dialog: MatDialog,
    private filterService: FilterSharedService,
    private filterstateServce: FiltersStateService,
    private datePipe: DatePipe
  ) {
    this.leavingComponent = false;
    this.patientId = localStorage.getItem('patientId');
    this.chartFromDate.setDate(this.chartFromDate.getDate() - 30);
    this.chartToDate = new Date();
    const user = this.auth.authData;
    this.userRole = user?.userDetails?.userRole;
    this.careproviderId = user?.userDetails['scopeId'];
    this.addPermission = localStorage.getItem('medicationPermission');
  }
  ngAfterViewInit(): void {
    this.leavingComponent = false;
    this.caregiverSharedservice.triggerdDates.subscribe((value) => {
      this.patientId = localStorage.getItem('patientId');
      setTimeout(() => {
        if (
          Object.keys(value).length &&
          (value.hasOwnProperty('from') || value.hasOwnProperty('to'))
        ) {
          const dynamicFromDate = this.caregiverSharedservice.formatDate(
            value['from'] ? value['from'] : this.chartFromDate
          );
          const dynamicFromTime = new Date(
            value['from'] ? value['from'] : this.chartFromDate
          ).toTimeString();
          const dynamicToDate = this.caregiverSharedservice.formatDate(
            value['to'] ? value['to'] : this.chartToDate
          );
          const dynamicToTime = new Date(
            value['to'] ? value['to'] : this.chartToDate
          ).toTimeString();
          (this.filterfromDate =
            dynamicFromDate + 'T' + dynamicFromTime.substring(0, 8)),
            (this.filterToDate =
              dynamicToDate + 'T' + dynamicToTime.substring(0, 8)),
            this.diagnosticHist(
              this.patientId,
              this.filterfromDate,
              this.filterToDate
            );
        } else if (Object.keys(value).length && value.hasOwnProperty('id')) {
          this.diagnosticHist(
            value['id'],
            this.chartFromDate,
            this.chartToDate
          );
        } else {
          this.chartFromDate.setDate(this.chartFromDate.getDate() + 1);
          this.chartToDate.setDate(this.chartToDate.getDate() + 1);
          const formattedStartDate =
            this.chartFromDate.toISOString().split('T')[0] + 'T00:00:00';

          // Format the end date to "YYYY-MM-DDT23:59:59"
          const formattedEndDate =
            this.chartToDate.toISOString().split('T')[0] + 'T23:59:59';

          this.diagnosticHist(
            this.patientId,
            formattedStartDate,
            formattedEndDate
          );
        }
      }, 1000);
    });
  }

  ngOnInit(): void {
    this.leavingComponent = false;
    // this.diagnosticHist(this.patientId)
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }
  Datecheck(date): any {
    let newDate = new Date();
    // newDate.setDate(newDate.getDate());
    const newConvertedDate = this.datePipe.transform(newDate, 'yyyy-MM-dd');
    // // Format the dates if needed
    // const formattedFromDate = date.split('T')[0].toString();
    // const formattedToDate = newDate.toISOString().split('T')[0].toString();
    const formattedFromDate = date.split('.')[0].split('T')[0].toString();
    const formattedToDate = newConvertedDate.toString();
    // const newConvertedDate = this.datePipe
    //   .transform(newDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ')
    //   .split('T')[0]
    //   .toString();
    // const newConvertedIncomingDate = this.datePipe
    //   .transform(incomingDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ')
    //   .split('T')[0]
    //   .toString();
    if (formattedFromDate === formattedToDate) {
      return true;
    }
  }
  diagnosticHist(id, fDate, tDate) {
    if (this.leavingComponent) {
      return;
    }
    const body = {
      dateFrom: fDate,
      dateTo: tDate,
    };
    this.service.getDiagnosticList(id, body).subscribe(
      (data) => {
        this.loadRes = false;
        this.vitlstotalElements = data.totalElements;
        this.dataSource = data?.content;
      },
      (err) => {
        this.loadRes = false;
        // this.snackbarService.error(err.message);
      }
    );
  }
  addDiagnostic(): void {
    const raiseDoctorModalConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    raiseDoctorModalConfig.disableClose = true;
    (raiseDoctorModalConfig.maxWidth = '100vw'),
      (raiseDoctorModalConfig.maxHeight = '100vh'),
      // (raiseDoctorModalConfig.height = '60vh'),
      (raiseDoctorModalConfig.width = '65%'),
      (raiseDoctorModalConfig.data = { mode: 'ADD' }),
      this.dialog
        .open(AddDiagnosticComponent, raiseDoctorModalConfig)
        .afterClosed()
        .subscribe((e) => {
          if (e) {
            this.filterService.statusCareProviderCall({
              status: 'ALL',
            });
            this.diagnosticHist(
              this.patientId,
              this.chartFromDate,
              this.chartToDate
            );
            this.caregiverSharedservice.changePatientCardData(true);
            this.filterstateServce.setFiltersArrayValues(null);
          }
        });
  }
  editDiagnostic(data: any): void {
    const editDoctorModalConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    editDoctorModalConfig.disableClose = true;
    (editDoctorModalConfig.maxWidth = '100vw'),
      (editDoctorModalConfig.maxHeight = '100vh'),
      // raiseDoctorModalConfig.height = "60vh",
      (editDoctorModalConfig.width = '65%'),
      (editDoctorModalConfig.data = {
        panelClass: 'dialog-responsive',

        edit: data,
        providerId: data.diagnosisId,
        providerName: data.name,
        // orgId: data.organization.name,
        branchId: data.clinicIds,
        mode: 'edit',
      }),
      this.dialog
        .open(AddDiagnosticComponent, editDoctorModalConfig)
        .afterClosed()
        .subscribe((e) => {
          if (e) {
            this.diagnosticHist(
              this.patientId,
              this.chartFromDate,
              this.chartToDate
            );
            this.caregiverSharedservice.changePatientCardData(true);
            this.filterstateServce.setFiltersArrayValues(null);
          }
        });
  }
  getDate(date) {
    if (date) {
      let newDate = date.split('T');
      return newDate[0];
    } else {
      return '-';
    }
  }
}
