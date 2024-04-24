import { DecimalPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
declare const CanvasJS: any;
@Component({
  selector: 'app-medication-adherence-chart',
  templateUrl: './medication-adherence-chart.component.html',
  styleUrls: ['./medication-adherence-chart.component.scss'],
})
export class MedicationAdherenceChartComponent
  implements AfterViewInit, OnDestroy
{
  @Input() patientId: string;
  maxDate: Date = new Date();
  leavingComponent: boolean = false;
  filterfromDate: string;
  filterToDate: string;
  chartToDate: Date = new Date();
  chartFromDate: Date = new Date();
  roleid: any;
  userRole: string;
  adherenceMedicationCount: any = [];
  BPAdherenceChartData: any;
  showGraph: boolean;
  showData = true;
  triggerMedicationSubscription: Subscription;
  @ViewChild('medicationChart') chartInput: ElementRef;

  constructor(
    private caregiverservice: CaregiverDashboardService,
    private caregiverSharedService: CaregiverSharedService,
    private snackBarService: SnackbarService,
    private auth: AuthService,
    private _decimalPipe: DecimalPipe
  ) {
    this.leavingComponent = false;
    this.chartFromDate.setDate(this.chartFromDate.getDate() - 30);
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
  }
  // ngOnInit() {
  //   // this.caregiverSharedService.triggerdBGAdherence.subscribe((value) => {
  //   //   if (value) this.BPAdherenceChartData = JSON.parse(value);
  //   // });
  // }
  ngAfterViewInit(): void {
    this.leavingComponent = false;

    this.caregiverSharedService.triggerdDates.subscribe((value) => {
      this.patientId = localStorage.getItem('patientId');

      if (
        Object.keys(value).length &&
        (value.hasOwnProperty('from') || value.hasOwnProperty('to'))
      ) {
        let fromDate = new Date(value['from'] || this.chartFromDate);
        let toDate = new Date(value['to'] || this.chartToDate);

        // Adjust the "from" date by adding one day
        fromDate.setDate(fromDate.getDate() + 1);
        toDate.setDate(toDate.getDate() + 1);

        const dynamicFromDate =
          this.caregiverSharedService.formatDate(fromDate);
        const dynamicFromTime = fromDate.toTimeString();
        const dynamicToDate = this.caregiverSharedService.formatDate(toDate);
        const dynamicToTime = toDate.toTimeString();

        this.filterfromDate =
          dynamicFromDate + 'T' + dynamicFromTime.substring(0, 8);
        this.filterToDate = dynamicToDate + 'T' + dynamicToTime.substring(0, 8);

        this.getMedicationAdherenceBP(
          localStorage.getItem('patientId'),
          this.filterfromDate,
          this.filterToDate
        );
      }

      // else if (Object.keys(value).length && value.hasOwnProperty('id')) {
      //   this.getMedicationAdherenceBP(
      //     value['id'],
      //     this.chartFromDate,
      //     this.chartToDate
      //   );
      // }
      else {
        this.getMedicationAdherenceBP(
          this.patientId,
          this.chartFromDate,
          this.chartToDate
        );
      }
    });
    this.triggerMedicationSubscription =
      this.caregiverSharedService.triggeredMedicationAdherence.subscribe(
        (res) => {
          if (res) {
            this.getMedicationAdherenceBP(
              this.patientId,
              this.chartFromDate,
              this.chartToDate
            );
          }
        }
      );
    // this.getMedicationAdherenceBP(this.patientId);
  }

  getMedicationAdherenceBP(pId, fDate, tDate) {
    if (this.leavingComponent) {
      return;
    }
    const finalFromDate = fDate;
    const finalToDate = tDate;

    const startDate = new Date(fDate);
    const endDate = new Date(tDate);

    // Format the start date to "YYYY-MM-DDT00:00:00"
    const formattedStartDate =
      startDate.toISOString().split('T')[0] + 'T00:00:00';

    // Format the end date to "YYYY-MM-DDT23:59:59"
    const formattedEndDate = endDate.toISOString().split('T')[0] + 'T23:59:59';

    const body = {
      dateFrom: formattedStartDate,
      dateTo: formattedEndDate,
    };
    this.caregiverservice.medicationadherenceBPBydate(pId, body).subscribe(
      (data) => {
        localStorage.setItem('medicationAdherenceData', JSON.stringify(data));
        this.caregiverSharedService.changeBPAdherence(
          localStorage.getItem('medicationAdherenceData')
        );
        this.dataProcessing(data);
      },
      (err) => {
        // this.snackBarService.error(err.message);
      }
    );
    // }
  }
  dataProcessing(data) {
    if (!data.length) {
      this.showData = false;
    }
    this.adherenceMedicationCount = [];
    const adherence = data['medicationAdharence'];
    const nonadherence = data['nonMedicationAdharence'];
    const totalCount = Number(adherence) + Number(nonadherence);
    const adherenceCount = this._decimalPipe.transform(
      (Number(adherence) / totalCount) * 100,
      '1.2-2'
    );
    const nonadherenceCount = this._decimalPipe.transform(
      (Number(nonadherence) / totalCount) * 100,
      '1.2-2'
    );
    this.adherenceMedicationCount.push(
      { y: Number(adherenceCount), label: 'Adherence', color: 'green' },
      { y: Number(nonadherenceCount), label: 'Non Adherence', color: 'grey' }
    );
    this.showGraph =
      Number(nonadherenceCount) || Number(adherenceCount) > 0 ? true : false;
    this.showData = false;
    if (this.showGraph) {
      setTimeout(() => {
        this.loadAdherenceMedication();
      }, 3000);
    }
  }
  loadAdherenceMedication() {
    const container = this.chartInput.nativeElement;
    if (container) {
      const chart = new CanvasJS.Chart(container, {
        width: 350,
        height: 241,
        animationEnabled: true,
        exportEnabled: false,
        axisY: {
          valueFormatString: "0'%'",
          includeZero: true,
          interval: 20,
          maximum: 100,
        },

        data: [
          {
            toolTipContent: '{y}%',
            type: 'column',
            dataPoints: this.adherenceMedicationCount,
          },
        ],
      });

      chart?.render();
    }
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
    this.triggerMedicationSubscription.unsubscribe();
  }
}
