import { Component, OnDestroy, OnInit } from '@angular/core';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-adherence',
  templateUrl: './adherence.component.html',
  styleUrls: ['./adherence.component.scss'],
})
export class AdherenceComponent implements OnInit, OnDestroy {
  loadResAddEditMedication: boolean;
  showmedicationAdherence = true;
  patientId: string;
  chartToDate: Date = new Date();
  chartFromDate: Date = new Date();
  filterfromDate: string;
  filterToDate: string;
  adheranceMedication: any;
  leavingComponent: boolean = false;
  loadRes:boolean = true;
  p = 2;
  pmed = 1;
  medp = 1;
  pres = 2;
  medsize = 2;
  userRole: string;

  constructor(
    private caregiverSharedservice: CaregiverSharedService,
    private service: CaregiverDashboardService,
    private auth: AuthService
  ) {
    this.leavingComponent = false;
    this.patientId = localStorage.getItem('patientId');
    this.chartFromDate.setDate(this.chartFromDate.getDate() - 30);
    this.chartToDate = new Date();
    const user = this.auth.authData;
    this.userRole = user?.userDetails?.userRole;
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }

  ngAfterViewInit() {
    this.leavingComponent = false;
    this.caregiverSharedservice.triggerdDates.subscribe((value) => {
      this.patientId = localStorage.getItem('patientId');
      if (this.leavingComponent) {
        return;
      }
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
          this.getMedicationAdherenceList(
            localStorage.getItem('patientId'),
            this.filterfromDate,
            this.filterToDate
          );
      }
      // else if (Object.keys(value).length && value.hasOwnProperty('id')) {
      //   this.getMedicationAdherenceList(
      //     value['id'],
      //     this.chartFromDate,
      //     this.chartToDate
      //   );
      // }
      else {
        this.getMedicationAdherenceList(
          this.patientId,
          this.chartFromDate,
          this.chartToDate
        );
      }
    });
  }

  ngOnInit(): void {}

  getMedicationAdherenceList(id, fDate, tDate) {
    const body = {
      dateFrom: fDate,
      dateTo: tDate,
    };
    this.service.getMedicationAdherencelist(id, body).subscribe(
      (data) => {
        this.loadRes=false;
        this.adheranceMedication = data.adherence;

      },
      (err) => {
        this.loadRes=false;
        // this.snackbarService.error(err.message);
      }
    );
  }

  onTableDataChange(event: any) {
    this.pmed = event;
  }
  getPage(event) {
    this.pmed = event;
    this.medp = event;
  }
}
